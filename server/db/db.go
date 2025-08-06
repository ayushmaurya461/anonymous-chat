package db

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5"
)

var Conn *pgx.Conn

func ConnectDB() error {

	url := os.Getenv("DB_URI")
	fmt.Println(url)
	conn, err := pgx.Connect(context.Background(), url)

	if err != nil {
		return fmt.Errorf("failed to connect :%w", err)
	}

	Conn = conn
	fmt.Println("Connected to DB")

	return nil
}
