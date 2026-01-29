-- =============================================================================
-- STATUS CASCADE TRIGGERS MIGRATION
-- =============================================================================
-- Project: Math7
-- Generated: 2026-01-29
-- Description: 
--   1. Add status column to domains, skills, questions tables
--   2. Create cascade triggers for status changes:
--      - When domain status changes → cascade to all skills and their questions
--      - When skill status changes → cascade to all questions
--   3. Migrate existing 'published' status to 'draft'
-- =============================================================================

-- Step 1: Create status enum type
DO $$ BEGIN
  CREATE TYPE public.curriculum_status AS ENUM ('draft', 'live');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Step 2: Add status column to domains (if not exists)
DO $$ BEGIN
  ALTER TABLE public.domains ADD COLUMN status public.curriculum_status DEFAULT 'draft'::public.curriculum_status NOT NULL;
EXCEPTION WHEN duplicate_column THEN 
  -- Column exists, update type if needed
  NULL;
END $$;

-- Step 3: Add status column to skills (if not exists)
DO $$ BEGIN
  ALTER TABLE public.skills ADD COLUMN status public.curriculum_status DEFAULT 'draft'::public.curriculum_status NOT NULL;
EXCEPTION WHEN duplicate_column THEN 
  NULL;
END $$;

-- Step 4: Add status column to questions (if not exists)
DO $$ BEGIN
  ALTER TABLE public.questions ADD COLUMN status public.curriculum_status DEFAULT 'draft'::public.curriculum_status NOT NULL;
EXCEPTION WHEN duplicate_column THEN 
  NULL;
END $$;

-- Step 5: Migrate any existing 'published' status to 'draft'
-- (In case status was stored as TEXT before)
UPDATE public.domains SET status = 'draft' WHERE status::text = 'published';
UPDATE public.skills SET status = 'draft' WHERE status::text = 'published';
UPDATE public.questions SET status = 'draft' WHERE status::text = 'published';

-- Step 6: Sync is_published with status
UPDATE public.domains SET is_published = (status = 'live');
UPDATE public.skills SET is_published = (status = 'live');
UPDATE public.questions SET is_published = (status = 'live');

-- =============================================================================
-- CASCADE TRIGGER FUNCTIONS
-- =============================================================================

-- Function: Cascade domain status change to skills and questions
CREATE OR REPLACE FUNCTION public.cascade_domain_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Only cascade if status actually changed
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    -- Update all skills under this domain
    UPDATE public.skills 
    SET status = NEW.status,
        is_published = (NEW.status = 'live')
    WHERE domain_id = NEW.id 
      AND deleted_at IS NULL;
    
    -- Update all questions under skills of this domain
    UPDATE public.questions q
    SET status = NEW.status,
        is_published = (NEW.status = 'live')
    FROM public.skills s
    WHERE q.skill_id = s.id 
      AND s.domain_id = NEW.id
      AND q.deleted_at IS NULL;
  END IF;
  
  -- Also sync is_published with status
  NEW.is_published := (NEW.status = 'live');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Cascade skill status change to questions
CREATE OR REPLACE FUNCTION public.cascade_skill_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Only cascade if status actually changed
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    -- Update all questions under this skill
    UPDATE public.questions 
    SET status = NEW.status,
        is_published = (NEW.status = 'live')
    WHERE skill_id = NEW.id 
      AND deleted_at IS NULL;
  END IF;
  
  -- Also sync is_published with status
  NEW.is_published := (NEW.status = 'live');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Sync is_published for questions when status changes
CREATE OR REPLACE FUNCTION public.sync_question_is_published()
RETURNS TRIGGER AS $$
BEGIN
  NEW.is_published := (NEW.status = 'live');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- CREATE TRIGGERS
-- =============================================================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS cascade_domain_status_trigger ON public.domains;
DROP TRIGGER IF EXISTS cascade_skill_status_trigger ON public.skills;
DROP TRIGGER IF EXISTS sync_question_is_published_trigger ON public.questions;

-- Trigger: Cascade domain status changes
CREATE TRIGGER cascade_domain_status_trigger
  BEFORE UPDATE OF status ON public.domains
  FOR EACH ROW
  EXECUTE FUNCTION public.cascade_domain_status();

-- Trigger: Cascade skill status changes
CREATE TRIGGER cascade_skill_status_trigger
  BEFORE UPDATE OF status ON public.skills
  FOR EACH ROW
  EXECUTE FUNCTION public.cascade_skill_status();

-- Trigger: Sync question is_published with status
CREATE TRIGGER sync_question_is_published_trigger
  BEFORE UPDATE OF status ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_question_is_published();

-- Also add triggers for INSERT to sync is_published
CREATE OR REPLACE FUNCTION public.sync_status_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  NEW.is_published := (NEW.status = 'live');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_domain_status_on_insert ON public.domains;
DROP TRIGGER IF EXISTS sync_skill_status_on_insert ON public.skills;
DROP TRIGGER IF EXISTS sync_question_status_on_insert ON public.questions;

CREATE TRIGGER sync_domain_status_on_insert
  BEFORE INSERT ON public.domains
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_status_on_insert();

CREATE TRIGGER sync_skill_status_on_insert
  BEFORE INSERT ON public.skills
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_status_on_insert();

CREATE TRIGGER sync_question_status_on_insert
  BEFORE INSERT ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_status_on_insert();

-- =============================================================================
-- CREATE INDEXES FOR STATUS COLUMN
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_domains_status ON public.domains(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_skills_status ON public.skills(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_questions_status ON public.questions(status) WHERE deleted_at IS NULL;

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
