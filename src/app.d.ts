import type { IDraft, ITeam, ITrainer } from '$lib/db/schema/DatabaseTypes';
import type { Database } from '$lib/db/types';
import type { Session, SupabaseClient } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession: () => Promise<Session | null>;
			getTrainer: () => Promise<ITrainer | null>;
			getDraft: () => Promise<IDraft | null>;
			getTeam: () => Promise<ITeam | null>;
		}
		interface PageData {
			session: Session | null;
		}
		// interface PageState {}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
