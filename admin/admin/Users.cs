using admin.Classes;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlTypes;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace admin
{
    public partial class Users : Form
    {
        private Database db;
        private List<UsersDB> UsersList = new List<UsersDB>();
        public Users()
        {
            InitializeComponent();

            db = new Database(@"Data source=C:\Users\tekeresdenes\repos\MaxxedOut\api\db\maxxedout.db");
            var users = db.Query("SELECT * FROM users;");

            foreach (DataRow user in users.Rows)
            {
                UsersDB UserObj = new UsersDB(user["nickname"].ToString(), user["email"].ToString(), user["password"].ToString());
                UsersList.Add(UserObj);
                Rows.Items.Add(UserObj);
            }

        }

        // Navigation handling

        private void exitToolStripMenuItem_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void exercisesToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Exercises ExercisesForm = new Exercises();
            ExercisesForm.ShowDialog();
        }

        private void muscleGroupsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Muscle_groups MusclegroupsForm = new Muscle_groups();
            MusclegroupsForm.ShowDialog();
        }

        // Data handling

        private void searchButton_Click(object sender, EventArgs e)
        {
            Rows.Items.Clear();
            nickname.Clear();
            email.Clear();
            password.Clear();

            if (string.IsNullOrWhiteSpace(search.Text))
            {
                foreach (var user in UsersList)
                {
                    Rows.Items.Add(user);
                }
            }
            else
            {
                foreach(var user in UsersList.Where(user => user.Nickname.Contains(search.Text) || user.Email.Contains(search.Text)))
                {
                    Rows.Items.Add(user);
                }
            }
        }

        public void Rows_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (Rows.SelectedItem == null) return;

            UsersDB user = Rows.SelectedItem as UsersDB;
            if (user == null) return;

            nickname.Text = user.Nickname;
            email.Text = user.Email;
            password.Clear();
        }

        private void addButton_Click(object sender, EventArgs e)
        {
            if(string.IsNullOrWhiteSpace(nickname.Text) || string.IsNullOrWhiteSpace(email.Text) || string.IsNullOrWhiteSpace(password.Text))
            {
                MessageBox.Show("Nickname, email nor password can be blank!");
                return;
            }

            if (UsersList.Any(usernn => usernn.Nickname == nickname.Text))
            {
                MessageBox.Show("Nickname already in database!");
                return;
            }

            if (UsersList.Any(usermail => usermail.Email == email.Text))
            {
                MessageBox.Show("Email already in database!");
                return;
            }

            UsersDB user = new UsersDB(nickname.Text, email.Text, password.Text);

            UsersList.Add(user);
            Rows.Items.Add(user);
        }

        private void saveButton_Click(object sender, EventArgs e)
        {
            if (Rows.SelectedIndex < 0)
            {
                MessageBox.Show("Need to select an item first to save it!");
                return;
            }

            UsersDB user = Rows.SelectedItem as UsersDB;

            if(user == null)
            {
                MessageBox.Show("Invalid item!");
                return;
            }

            if (string.IsNullOrWhiteSpace(nickname.Text) || string.IsNullOrWhiteSpace(email.Text))
            {
                MessageBox.Show("Nickname and email can't be blank!");
                return;
            }

            user.Email = email.Text;
            user.Nickname = nickname.Text;
            if(!string.IsNullOrWhiteSpace(password.Text)) user.Password = password.Text;

            Rows.Items[Rows.SelectedIndex] = user;
        }

        private void deleteButton_Click(object sender, EventArgs e)
        {
            if (Rows.SelectedIndex < 0)
            {
                MessageBox.Show("Need to select an item first to delete it!");
                return;
            }

            UsersDB user = Rows.SelectedItem as UsersDB;

            UsersList.Remove(user);
            Rows.Items.Remove(user);

            nickname.Clear();
            email.Clear();
            password.Clear();
        }
    }

    public class UsersDB
    {
        public string Nickname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public UsersDB( string nickname, string email, string password)
        {
            Nickname = nickname;
            Email = email;
            Password = password;
        }

        public override string ToString()
        {
            return Nickname;
        }

    }
}
