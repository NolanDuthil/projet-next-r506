export type Intervenants = {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    key: string;
    creationdate: string;
    enddate: string;
    availability: Record<string, any>;
};