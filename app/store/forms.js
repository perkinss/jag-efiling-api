let { execute } = require('yop-postgresql');

let Forms = function() {
};

Forms.prototype.selectByLogin = function(login, callback) {
    var select = `
        SELECT  forms.id, 
                type, 
                status, 
                modified,
                data
        FROM forms, person
        WHERE person.login = $1
        AND forms.person_id = person.id
        AND status <> 'archived'
    `;
    execute(select, [login], callback);
};

Forms.prototype.selectOne = function(id, callback) {
    execute('select type, status, modified, data from forms where id = $1', [id], callback);
};

Forms.prototype.create = function(options, callback) {
    execute('insert into forms(type, status, data, person_id) values($1, $2, $3, $4);', 
        [options.type, options.status, options.data, options.person_id], ()=> {
            execute('SELECT last_value FROM forms_id_seq;', [], callback);
        });
};
Forms.prototype.update = function(form, callback) {
    execute('update forms set type = $1, status = $2, data = $3, modified = current_timestamp where id = $4',
        [form.type, form.status, form.data, form.id], function() {
            execute('SELECT last_value FROM forms_id_seq;', [], callback);
        });
};
Forms.prototype.archive = function(ids, callback) {
    let statements = [];
    for (var i=0; i<ids.length; i++) {
        statements.push({ sql:`update forms set status='archived' where id = $1`, params:[ids[i]] });
    }
    execute(statements, [], callback);
};

module.exports = {
    Forms:Forms
};