CREATE OR REPLACE FUNCTION public.get_hall_offers()
 RETURNS TABLE(id uuid, title text, price numeric, images text[], seller jsonb, offer_type text, created_at text, views_count integer, turnaround_days integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$DECLARE
  user_hall text;
BEGIN
  -- Get the authenticated user's hall of residence
  SELECT p.hall_of_residence INTO user_hall
  FROM profiles p
  WHERE p.id = auth.uid();
  
  -- If user not found or not authenticated, return empty
  IF user_hall IS NULL THEN
    RETURN;
  END IF;
  
  -- Return offers from the same hall
  RETURN QUERY
  SELECT 
    o.id,
    o.title,
    o.price,
    o.images as images, -- Return first image only
    jsonb_build_object(
      'name', p.full_name,
      'avatar', COALESCE(
        p.avatar_url, 
        'https://ui-avatars.com/api/?name=' || REPLACE(p.full_name, ' ', '+') || 
        '&background=f97316&color=fff&size=200&bold=true&rounded=true'
      ),
      'hall_of_residence', p.hall_of_residence,
      'rating', COALESCE(ROUND(AVG(r.rating)::numeric, 1), 5.0),
      'review_count', COUNT(r.id)::integer
    ) as seller,
    o.offer_type,
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
    COALESCE(o.views_count, 0) as views_count,
    o.turnaround_days
  FROM offers o
  INNER JOIN profiles p ON o.seller_id = p.id
  LEFT JOIN reviews r ON r.reviewee_id = p.id
  WHERE 
    p.hall_of_residence = user_hall
    AND o.status = 'active'
    AND o.offer_type = 'product'
    AND p.is_active = true
    AND COALESCE(p.is_banned, false) = false
  GROUP BY o.id, o.title, o.price, o.images, o.offer_type, o.created_at, 
           o.views_count, o.turnaround_days, p.full_name, p.avatar_url, p.hall_of_residence
  ORDER BY o.created_at DESC;
END;$function$
