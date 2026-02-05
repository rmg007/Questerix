-- =============================================
-- MAINTENANCE & ALERTS (Project Oracle & Observability)
-- =============================================

-- 1. Error Log Pruning (Maintenance)
-- Keep only the last 30 days of error logs to prevent table bloat
CREATE OR REPLACE FUNCTION public.prune_old_error_logs()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count INT;
BEGIN
    DELETE FROM public.error_logs
    WHERE created_at < now() - interval '30 days'
    AND status != 'promoted'; -- Keep promoted logs for knowledge reference
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- 2. Critical Alerting Logic
-- Simple trigger to detect critical errors and flag them for Edge Function processing
-- (Wait: Supabase has 'Database Webhooks' in the dashboard, but we can set up the 
-- plumbing here by adding a specific flag or using a queue)

ALTER TABLE public.error_logs ADD COLUMN IF NOT EXISTS alert_sent BOOLEAN DEFAULT FALSE;

CREATE OR REPLACE FUNCTION public.trigger_critical_alert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only alert on 'critical' severity or specific high-impact error types
    -- Note: severity isn't in error_logs yet, let's add it or use extra_context
    IF NEW.error_type ILIKE '%Critical%' OR (NEW.extra_context->>'severity') = 'critical' THEN
        -- This is where a Database Webhook would normally fire.
        -- For now, we'll mark it as needing an alert.
        NEW.extra_context = jsonb_set(NEW.extra_context, '{alert_needed}', 'true');
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_critical_error ON public.error_logs;
CREATE TRIGGER on_critical_error
    BEFORE INSERT ON public.error_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_critical_alert();

-- 3. Vector Index Optimization (Search Recall Fix)
-- Re-create the index with HNSW for better recall on dynamic data
-- If HNSW is unavailable, it will fallback to IVFFlat or error out, 
-- notifying us to stick to IVFFlat with more lists.

DROP INDEX IF EXISTS knowledge_chunks_embedding_idx;

-- Using HNSW for better recall and performance as the KB grows
-- m=16, ef_construction=64 are good balanced defaults
CREATE INDEX knowledge_chunks_embedding_idx 
    ON knowledge_chunks 
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- 4. Cleanup/Maintenance Schedule Documentation
-- To enable the cron job, run:
-- SELECT cron.schedule('prune-errors-daily', '0 0 * * *', 'SELECT public.prune_old_error_logs()');
