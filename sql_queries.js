module.exports = {
    getDbSchema:`SELECT 
    t.TABLE_SCHEMA,
    c.TABLE_NAME,
    c.COLUMN_NAME,
    c.COLUMN_DEFAULT,
    c.IS_NULLABLE,
    c.DATA_TYPE,
    c.CHARACTER_MAXIMUM_LENGTH,
    c.COLUMN_TYPE,
    c.COLUMN_KEY,
    c.EXTRA
    FROM INFORMATION_SCHEMA.TABLES as t
    join INFORMATION_SCHEMA.COLUMNS as c on c.TABLE_NAME=t.TABLE_NAME
    where t.DATA_LENGTH!=0 and t.TABLE_SCHEMA = ?
    order by c.TABLE_NAME asc ;`,
    getTables:'show tables;',
    getCreateDB:`SHOW CREATE DATABASE ? ;`,
    getCreateTable:`SHOW CREATE TABLE ? ;`,
    getColumns:`SHOW COLUMNS FROM ? ;`,
    getIndex:`SHOW INDEX FROM ? ;`,
};

