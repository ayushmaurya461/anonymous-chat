package db

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Conn *pgxpool.Pool

func ConnectDB() error {

	config, err := pgxpool.ParseConfig(os.Getenv("DB_URI"))

	if err != nil {
		log.Fatalf("Unable to parse DB config: %v\n", err)
	}

	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}

	Conn = pool
	fmt.Println("Connected to DB")

	return nil
}

func GetUsernameByID(ctx context.Context, id string) string {
	query := "SELECT name FROM users WHERE id = $1"
	var username string
	fmt.Println("QUERY", query, id)
	err := Conn.QueryRow(ctx, query, id).Scan(&username)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(username)
	return username
}
