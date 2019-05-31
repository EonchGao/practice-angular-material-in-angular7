export interface Project {
    id?: string;
    name: string;
    desc?: string;
    coverImg: string;
    taskLists?: string[]; // 列表id
    memnbers?: string[]; // 成员id
}
