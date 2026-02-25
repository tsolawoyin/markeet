CREATE OR REPLACE FUNCTION public.get_user_offers(user_id uuid, filter_status text DEFAULT NULL::text, filter_type text DEFAULT NULL::text, page_limit integer DEFAULT 20, page_offset integer DEFAULT 0)
 RETURNS TABLE(id uuid, title text, description text, price numeric, offer_type text, turnaround_days integer, images text[], tags text[], views_count integer, created_at text, status text, seller jsonb, category jsonb, total_count bigint, has_more boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$DECLARE
  total_records bigint;
BEGIN
  -- Get total count of matching records
  SELECT COUNT(*) INTO total_records
  FROM offers o
  WHERE 
    o.seller_id = user_id
    AND (filter_status IS NULL OR o.status = filter_status)
    AND (filter_type IS NULL OR o.offer_type = filter_type);
  
  -- Return offers belonging to the user
  RETURN QUERY
  SELECT 
    o.id,
    o.title,
    o.description,
    o.price,
    o.offer_type,
    o.turnaround_days,
    o.images as images,
    o.tags,
    COALESCE(o.views_count, 0) as views_count,
    -- Format created_at as relative time
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
    o.status,
    -- Seller information
    jsonb_build_object(
      'id', p.id,
      'name', p.full_name,
      'avatar', COALESCE(p.avatar_url, 'https://ui-avatars.com/api/?name=' || REPLACE(p.full_name, ' ', '+') || '&background=f97316&color=fff&size=200&bold=true&rounded=true'),
      'hall_of_residence', p.hall_of_residence,
      'course', p.course,
      'rating', COALESCE(ROUND(AVG(r.rating)::numeric, 1), 5.0),
      'review_count', COUNT(r.id)::integer,
      'completed_orders', 0
    ) as seller,
    -- Category information
    jsonb_build_object(
      'id', c.id,
      'name', c.name,
      'description', c.description
    ) as category,
    total_records as total_count,
    (page_offset + page_limit < total_records) as has_more
  FROM offers o
  INNER JOIN profiles p ON o.seller_id = p.id
  LEFT JOIN categories c ON o.category_id = c.id
  LEFT JOIN reviews r ON r.reviewee_id = p.id
  WHERE 
    o.seller_id = user_id
    AND (filter_status IS NULL OR o.status = filter_status)
    AND (filter_type IS NULL OR o.offer_type = filter_type)
  GROUP BY 
    o.id, o.title, o.description, o.price, o.offer_type, o.turnaround_days,
    o.images, o.tags, o.views_count, o.created_at, o.status,
    p.id, p.full_name, p.avatar_url, p.hall_of_residence, p.course,
    c.id, c.name, c.description
  ORDER BY o.created_at DESC
  LIMIT page_limit
  OFFSET page_offset;
END;$function$
