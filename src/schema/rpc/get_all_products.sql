CREATE OR REPLACE FUNCTION public.get_all_products(
  page_limit  integer DEFAULT 20,
  page_offset integer DEFAULT 0
)
RETURNS TABLE (
  id             uuid,
  title          text,
  price          numeric,
  images         text[],
  seller         jsonb,
  offer_type     text,
  created_at     text,
  views_count    integer,
  turnaround_days integer,
  total_count    bigint,
  has_more       boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  total_records bigint;
BEGIN

  -- Get total count of matching records
  SELECT COUNT(*)
  INTO total_records
  FROM offers o
  INNER JOIN profiles p ON o.seller_id = p.id
  WHERE o.status            = 'active'
    AND o.offer_type        = 'product'
    AND p.is_active         = true
    AND COALESCE(p.is_banned, false) = false;

  -- Return all products
  RETURN QUERY
  SELECT
    o.id,
    o.title,
    o.price,
    o.images,
    jsonb_build_object(
      'name',              p.full_name,
      'avatar',            COALESCE(
                             p.avatar_url,
                             'https://ui-avatars.com/api/?name='
                               || REPLACE(p.full_name, ' ', '+')
                               || '&background=f97316&color=fff&size=200&bold=true&rounded=true'
                           ),
      'hall_of_residence', p.hall_of_residence,
      'rating',            COALESCE(ROUND(AVG(r.rating)::numeric, 1), 5.0),
      'review_count',      COUNT(r.id)::integer,
      'badge_tier',        get_seller_badge_tier(p.id)
    )                                                          AS seller,
    o.offer_type,
    CASE
      WHEN NOW() - o.created_at < INTERVAL '1 minute' THEN
        'Just now'
      WHEN NOW() - o.created_at < INTERVAL '1 hour' THEN
        EXTRACT(EPOCH FROM (NOW() - o.created_at))::integer / 60    || 'm ago'
      WHEN NOW() - o.created_at < INTERVAL '1 day' THEN
        EXTRACT(EPOCH FROM (NOW() - o.created_at))::integer / 3600  || 'h ago'
      WHEN NOW() - o.created_at < INTERVAL '7 days' THEN
        EXTRACT(EPOCH FROM (NOW() - o.created_at))::integer / 86400 || 'd ago'
      WHEN NOW() - o.created_at < INTERVAL '30 days' THEN
        EXTRACT(EPOCH FROM (NOW() - o.created_at))::integer / 604800 || 'w ago'
      ELSE
        TO_CHAR(o.created_at, 'Mon DD')
    END                                                        AS created_at,
    COALESCE(o.views_count, 0)                                 AS views_count,
    o.turnaround_days,
    total_records                                              AS total_count,
    (page_offset + page_limit < total_records)                 AS has_more

  FROM offers o
  INNER JOIN profiles p ON o.seller_id   = p.id
  LEFT  JOIN reviews  r ON r.reviewee_id = p.id

  WHERE o.status                   = 'active'
    AND o.offer_type               = 'product'
    AND p.is_active                = true
    AND COALESCE(p.is_banned, false) = false

  GROUP BY
    o.id,
    o.title,
    o.price,
    o.images,
    o.offer_type,
    o.created_at,
    o.views_count,
    o.turnaround_days,
    p.id,
    p.full_name,
    p.avatar_url,
    p.hall_of_residence

  ORDER BY o.created_at DESC, o.id DESC
  LIMIT  page_limit
  OFFSET page_offset;

END;
$$;