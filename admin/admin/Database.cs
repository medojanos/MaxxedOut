using Microsoft.Data.Sqlite;
using System.Data;

    public class Database
    {
        private readonly string _conn;

        public Database(string connectionString)
        {
            _conn = connectionString;
        }

        public SqliteConnection GetConnection()
        {
            return new SqliteConnection(_conn);
        }
        public DataTable Query(string sql)
        {
            var con = GetConnection();
            con.Open();

            var cmd = con.CreateCommand();
            cmd.CommandText = sql;

            var table = new DataTable();
            table.Load(cmd.ExecuteReader());

            return table;
        }
        public void Execute(string sql)
        {
            var con = GetConnection();
            con.Open();

            var cmd = con.CreateCommand();
            cmd.CommandText = sql;
            cmd.ExecuteNonQuery();
        }
    }
