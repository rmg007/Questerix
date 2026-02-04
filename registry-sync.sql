BEGIN;
INSERT INTO kb_registry (name, type, platform, tech_stack) 
             VALUES ('questerix-admin', 'app', 'cloudflare-pages', '{"framework":"react","build":"vite"}') 
             ON CONFLICT (name) DO UPDATE SET 
                type = EXCLUDED.type, 
                platform = EXCLUDED.platform, 
                tech_stack = EXCLUDED.tech_stack,
                updated_at = NOW();
INSERT INTO kb_registry (name, type, platform, tech_stack) 
             VALUES ('questerix-student', 'app', 'cloudflare-pages', '{"target":"web","framework":"flutter"}') 
             ON CONFLICT (name) DO UPDATE SET 
                type = EXCLUDED.type, 
                platform = EXCLUDED.platform, 
                tech_stack = EXCLUDED.tech_stack,
                updated_at = NOW();
INSERT INTO kb_registry (name, type, platform, tech_stack) 
             VALUES ('questerix-landing', 'app', 'cloudflare-pages', '{"framework":"react","build":"vite"}') 
             ON CONFLICT (name) DO UPDATE SET 
                type = EXCLUDED.type, 
                platform = EXCLUDED.platform, 
                tech_stack = EXCLUDED.tech_stack,
                updated_at = NOW();
INSERT INTO kb_registry (name, type, platform, tech_stack) 
             VALUES ('questerix-backend', 'service', 'supabase', '{"database":"postgresql","rls":"enabled"}') 
             ON CONFLICT (name) DO UPDATE SET 
                type = EXCLUDED.type, 
                platform = EXCLUDED.platform, 
                tech_stack = EXCLUDED.tech_stack,
                updated_at = NOW();
INSERT INTO kb_registry (name, type, platform, tech_stack) 
             VALUES ('project-oracle', 'service', 'local-psh', '{"engine":"pgvector","model":"text-embedding-3-small"}') 
             ON CONFLICT (name) DO UPDATE SET 
                type = EXCLUDED.type, 
                platform = EXCLUDED.platform, 
                tech_stack = EXCLUDED.tech_stack,
                updated_at = NOW();
INSERT INTO kb_registry (name, type, platform, tech_stack) 
             VALUES ('questerix-domain', 'library', 'dart-package', '{"framework":"dart","codegen":"freezed"}') 
             ON CONFLICT (name) DO UPDATE SET 
                type = EXCLUDED.type, 
                platform = EXCLUDED.platform, 
                tech_stack = EXCLUDED.tech_stack,
                updated_at = NOW();
INSERT INTO kb_metrics (project_name, language, lines_of_code, file_count)
                     VALUES ('questerix-admin', 'sql', 65, 1)
                     ON CONFLICT (project_name, language) DO UPDATE SET
                        lines_of_code = EXCLUDED.lines_of_code,
                        file_count = EXCLUDED.file_count,
                        last_analyzed_at = NOW();
INSERT INTO kb_metrics (project_name, language, lines_of_code, file_count)
                     VALUES ('questerix-admin', 'typescript', 14144, 94)
                     ON CONFLICT (project_name, language) DO UPDATE SET
                        lines_of_code = EXCLUDED.lines_of_code,
                        file_count = EXCLUDED.file_count,
                        last_analyzed_at = NOW();
INSERT INTO kb_metrics (project_name, language, lines_of_code, file_count)
                     VALUES ('questerix-student', 'dart', 17051, 69)
                     ON CONFLICT (project_name, language) DO UPDATE SET
                        lines_of_code = EXCLUDED.lines_of_code,
                        file_count = EXCLUDED.file_count,
                        last_analyzed_at = NOW();
INSERT INTO kb_metrics (project_name, language, lines_of_code, file_count)
                     VALUES ('questerix-landing', 'typescript', 3345, 21)
                     ON CONFLICT (project_name, language) DO UPDATE SET
                        lines_of_code = EXCLUDED.lines_of_code,
                        file_count = EXCLUDED.file_count,
                        last_analyzed_at = NOW();
INSERT INTO kb_metrics (project_name, language, lines_of_code, file_count)
                     VALUES ('questerix-backend', 'sql', 3533, 46)
                     ON CONFLICT (project_name, language) DO UPDATE SET
                        lines_of_code = EXCLUDED.lines_of_code,
                        file_count = EXCLUDED.file_count,
                        last_analyzed_at = NOW();
INSERT INTO kb_metrics (project_name, language, lines_of_code, file_count)
                     VALUES ('questerix-backend', 'typescript', 215, 2)
                     ON CONFLICT (project_name, language) DO UPDATE SET
                        lines_of_code = EXCLUDED.lines_of_code,
                        file_count = EXCLUDED.file_count,
                        last_analyzed_at = NOW();
INSERT INTO kb_metrics (project_name, language, lines_of_code, file_count)
                     VALUES ('project-oracle', 'typescript', 498, 8)
                     ON CONFLICT (project_name, language) DO UPDATE SET
                        lines_of_code = EXCLUDED.lines_of_code,
                        file_count = EXCLUDED.file_count,
                        last_analyzed_at = NOW();
INSERT INTO kb_metrics (project_name, language, lines_of_code, file_count)
                     VALUES ('project-oracle', 'powershell', 92, 1)
                     ON CONFLICT (project_name, language) DO UPDATE SET
                        lines_of_code = EXCLUDED.lines_of_code,
                        file_count = EXCLUDED.file_count,
                        last_analyzed_at = NOW();
INSERT INTO kb_metrics (project_name, language, lines_of_code, file_count)
                     VALUES ('questerix-domain', 'dart', 1654, 21)
                     ON CONFLICT (project_name, language) DO UPDATE SET
                        lines_of_code = EXCLUDED.lines_of_code,
                        file_count = EXCLUDED.file_count,
                        last_analyzed_at = NOW();
COMMIT;
