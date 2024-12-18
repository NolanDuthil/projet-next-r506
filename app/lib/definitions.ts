export type Intervenants = {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    key: string;
    creationdate: string;
    enddate: string;
    availability: Record<string, any>;
    workweek: Record<string, any>;
    last_modified?: string;
};

export type Users = {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
};