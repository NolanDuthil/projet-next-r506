export type Intervenants = {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    key: string;
    creationdate: string;
    enddate: string;
    availability: Record<string, { start_time: string; end_time: string }[]>;
    workweek: Record<string, number>;
    last_modified?: string;
};

export type Users = {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
};