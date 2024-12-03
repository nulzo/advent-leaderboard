export interface StarCompletion {
    get_star_ts: number;
    star_index: number;
}

export interface DayLevel {
    [level: string]: StarCompletion;
}

export interface CompletionDayLevel {
    [day: string]: DayLevel;
}

export interface Member {
    local_score: number;
    completion_day_level: CompletionDayLevel;
    global_score: number;
    last_star_ts: number;
    id: number;
    stars: number;
    name: string;
}

export interface LeaderboardData {
    members: {
        [memberId: string]: Member;
    };
    owner_id: number;
    event: string;
}
