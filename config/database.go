package config

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3"
)

// DB 全局数据库连接
var DB *sql.DB

// InitDB 初始化数据库
func InitDB() {
	var err error

	// 1. 打开数据库文件
	DB, err = sql.Open("sqlite3", "./todos.db")
	if err != nil {
		panic("database can't be opened: " + err.Error())
	}

	// 2. 测试连接
	err = DB.Ping()
	if err != nil {
		panic("database can't be connected: " + err.Error())
	}

	// 3. 创建表
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS todos (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		completed BOOLEAN DEFAULT 0
	);
	`

	_, err = DB.Exec(createTableSQL)
	if err != nil {
		panic("table can't be created: " + err.Error())
	}

	println("✅ Database initialized successfully")
}