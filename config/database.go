package config

import (
	"database/sql"
	"log"
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
		completed BOOLEAN DEFAULT 0,
		user_id INTEGER NOT NULL,
		FOREIGN KEY (user_id) REFERENCES users(id)
	);`

	// 创建用户表
	createUserTable := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT UNIQUE NOT NULL,
		password TEXT NOT NULL
	);`

	// 先创建用户表
	if _, err := DB.Exec(createUserTable); err != nil {
		log.Fatal("创建用户表失败:", err)
	}
	
	_, err = DB.Exec(createTableSQL)
	if err != nil {
		panic("table can't be created: " + err.Error())
	}

	println("✅ Database initialized successfully")
}