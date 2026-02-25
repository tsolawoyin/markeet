CREATE OR REPLACE FUNCTION public.search_offers(search_text text DEFAULT ''::text, filter_category_id uuid DEFAULT NULL::uuid, filter_offer_type text DEFAULT NULL::text, filter_condition text DEFAULT NULL::text, filter_hall text DEFAULT NULL::text, filter_price_min numeric DEFAULT NULL::numeric, filter_price_max numeric DEFAULT NULL::numeric, sort_by text DEFAULT 'newest'::text, page_limit integer DEFAULT 20, page_offset integer DEFAULT 0)
 RETURNS TABLE(id uuid, title text, price numeric, images text[], seller jsonb, offer_type text, created_at text, views_count integer, turnaround_days integer, condition text, total_count bigint, has_more boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  total_records bigint;
BEGIN
  -- Get total count of matching records
  SELECT COUNT(*) INTO total_records
  FROM offers o
  INNER JOIN profiles p ON o.seller_id = p.id
  WHERE
    o.status = 'active'
    AND p.is_active = true
    AND COALESCE(p.is_banned, false) = false
    AND (
      search_text = '' OR (
        o.title ILIKE '%' || search_text || '%'
        OR o.description ILIKE '%' || search_text || '%'
        OR EXISTS (SELECT 1 FROM unnest(o.tags) t WHERE t ILIKE '%' || search_text || '%')
      )
    )
    AND (filter_category_id IS NULL OR o.category_id = filter_category_id)
    AND (filter_offer_type IS NULL OR o.offer_type = filter_offer_type)
    AND (filter_condition IS NULL OR o.condition = filter_condition)
    AND (filter_hall IS NULL OR p.hall_of_residence = filter_hall)
    AND (filter_price_min IS NULL OR o.price >= filter_price_min)
    AND (filter_price_max IS NULL OR o.price <= filter_price_max);

  -- Return matching offers
  RETURN QUERY
  SELECT
    o.id,
    o.title,
    o.price,
    o.images as images,
    jsonb_build_object(
      'name', p.full_name,
      'avatar', COALESCE(p.avatar_url, 'https://ui-avatars.com/api/?name=' || REPLACE(p.full_name, ' ', '+') || '&background=f97316&color=fff&size=200&bold=true&rounded=true'),
      'hall_of_residence', p.hall_of_residence,
      'rating', COALESCE(ROUND(AVG(r.rating)::numeric, 1), 5.0),
      'review_count', COUNT(r.id)::integer,
      'badge_tier', get_seller_badge_tier(p.id)
    ) as seller,
    o.offer_type,
    CASE
      WHEN NOW() - o.created_at < INTERVAL '1 minute' THEN 'Just now'
      WHEN NOW() - o.created_at < INTERVAL '1 hour' THEN
        EXTRACT(EPOCH FROM (NOW() - o.created_at))::integer / 60 || 'm ago'
      WHEN NOW() - o.created_at < INTERVAL '1 day' THEN
        EXTRACT(EPOCH FROM (NOW() - o.created_at))::integer / 3600 || 'h ago'
      WHEN NOW() - o.created_at < INTERVAL '7 days' THEN
        EXTRACT(EPOCH FROM (NOW() - o.created_at))::integer / 86400 || 'd ago'
      WHEN NOW() - o.created_at < INTERVAL '30 days' THEN
        EXTRACT(EPOCH FROM (NOW() - o.created_at))::integer / 604800 || 'w ago'
      ELSE
        TO_CHAR(o.created_at, 'Mon DD')
    END as created_at,
    COALESCE(o.views_count, 0) as views_count,
    o.turnaround_days,
    o.condition,
    total_records as total_count,
    (page_offset + page_limit < total_records) as has_more
  FROM offers o
  INNER JOIN profiles p ON o.seller_id = p.id
  LEFT JOIN reviews r ON r.reviewee_id = p.id
  WHERE
    o.status = 'active'
    AND p.is_active = true
    AND COALESCE(p.is_banned, false) = false
    AND (
      search_text = '' OR (
        o.title ILIKE '%' || search_text || '%'
        OR o.description ILIKE '%' || search_text || '%'
        OR EXISTS (SELECT 1 FROM unnest(o.tags) t WHERE t ILIKE '%' || search_text || '%')
      )
    )
    AND (filter_category_id IS NULL OR o.category_id = filter_category_id)
    AND (filter_offer_type IS NULL OR o.offer_type = filter_offer_type)
    AND (filter_condition IS NULL OR o.condition = filter_condition)
    AND (filter_hall IS NULL OR p.hall_of_residence = filter_hall)
    AND (filter_price_min IS NULL OR o.price >= filter_price_min)
    AND (filter_price_max IS NULL OR o.price <= filter_price_max)
  GROUP BY o.id, o.title, o.price, o.images, o.offer_type, o.created_at,
           o.views_count, o.turnaround_days, o.condition, p.id, p.full_name, p.avatar_url, p.hall_of_residence
  ORDER BY
    CASE WHEN sort_by = 'cheapest' THEN o.price END ASC,
    CASE WHEN sort_by = 'popular' THEN o.views_count END DESC,
    CASE WHEN sort_by = 'newest' OR sort_by IS NULL THEN EXTRACT(EPOCH FROM o.created_at) END DESC,
    o.id DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$function$
