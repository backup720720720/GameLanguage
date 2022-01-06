// noinspection JSUnusedGlobalSymbols

(async () => {
    /*** @type {{archive_uuid: number, projects: Object<string, {type: 1 | 2, createdTimestamp: number, lastUsedTimestamp: number, code: string}>, archived: {name: string, id: number, type: 1 | 2, createdTimestamp: number, archivedTimestamp: number, code: string}[]}} */
    const json = JSON.parse(localStorage.getItem("projects") || '{"archive_uuid": 0, "projects":{}, "archived":[]}');
    const _generate_archive_uuid = () => json.archive_uuid++;
    document.ProjectAPI = {
        json: () => json,
        TYPES: {
            console: 1,
            game: 2,
            block: 3
        },
        create_project: (name, type, code = "") => {
            if (name.split("").some(i => !/\w|\d/.test(i)) || !name) return "invalid-project-name";
            if (json.projects[name]) return "project-exists";
            json.projects[name] = {type, createdTimestamp: Date.now(), lastUsedTimestamp: Date.now(), code};
            document.ProjectAPI.save_all();
            return "success";
        },
        archive_project: (name) => {
            if (!json.projects[name]) return "project-doesnt-exist";
            const old = json.projects[name];
            json.archived.push({
                name,
                id: _generate_archive_uuid(),
                type: old.type,
                createdTimestamp: old.createdTimestamp,
                archivedTimestamp: Date.now(),
                code: old.code
            });
            delete json.projects[name];
            document.ProjectAPI.save_all();
            return "success";
        },
        re_archive_project: (archive_id) => {
            let index = Object.keys(json.archived).find(index => json.archived[index].id === archive_id * 1);
            if (index === null) return "archived-dont-exist";
            const archived = json.archived[index];
            if (json.projects[archived.name]) return "project-exists-try-rename";
            json.projects[archived.name] = {
                createdTimestamp: archived.createdTimestamp,
                lastUsedTimestamp: Date.now(),
                code: archived.code,
                type: archived.type
            };
            delete json.archived[index];
            json.archived = json.archived.filter(i => i);
            document.ProjectAPI.save_all();
            return "success";
        },
        rename_archived_project: (archive_id, name) => {
            if (name.split("").some(i => !/\w|\d/.test(i)) || !name) return "invalid-project-name";
            let index = Object.keys(json.archived).find(index => json.archived[index].id === archive_id * 1);
            if (index === null) return "archived-dont-exist";
            json.archived[index].name = name;
            document.ProjectAPI.save_all();
            return "success";
        },
        remove_archived_project: archive_id => {
            let index = Object.keys(json.archived).find(index => json.archived[index].id === archive_id * 1);
            if (index === null) return "archived-dont-exist";
            delete json.archived[index];
            json.archived = json.archived.filter(i => i);
            document.ProjectAPI.save_all();
            return "success";
        },
        update_project_code: (name, code) => {
            if (!json.projects[name]) return "project-doesnt-exist";
            json.projects[name].code = code;
            document.ProjectAPI.save_all();
            return "success";
        },
        update_project_last_used: (name, lastUsedTimestamp = Date.now()) => {
            if (!json.projects[name]) return "project-doesnt-exist";
            json.projects[name].lastUsedTimestamp = lastUsedTimestamp;
            document.ProjectAPI.save_all();
            return "success";
        },
        rename_project: (name, newName) => {
            if (newName.split("").some(i => !/\w|\d/.test(i)) || !newName) return "invalid-project-name";
            if (!json.projects[name]) return "project-doesnt-exist";
            if (json.projects[newName]) return "project-exists";
            json.projects[newName] = json.projects[name];
            delete json.projects[name];
            document.ProjectAPI.save_all();
            return "success";
        },
        save_all: () => JSON.stringify(document.ProjectAPI.json()) !== localStorage.getItem("projects") ? localStorage.setItem("projects", JSON.stringify(document.ProjectAPI.json())) : null
    };
})();