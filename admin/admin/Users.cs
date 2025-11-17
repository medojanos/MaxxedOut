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

            db = new Database(@"Data source=D:\Projektek\MaxxedOut\MaxxedOut\api\db\maxxedout.db");
            var users = db.Query("SELECT * FROM users;");

            foreach (DataRow user in users.Rows)
            {
                UsersList.Add(new UsersDB(user["nickname"].ToString(), user["email"].ToString()));
                Rows.Items.Add(user["nickname"].ToString());
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
            if (string.IsNullOrWhiteSpace(search.Text))
            {
                // listázás
            }
            
        }

        public void Rows_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (Rows.SelectedIndex < 0 || Rows.SelectedIndex >= UsersList.Count()) return;
            nickname.Text = UsersList[Rows.SelectedIndex].Nickname;
            email.Text = UsersList[Rows.SelectedIndex].Email;
            password.Clear();
        }

        private void addButton_Click(object sender, EventArgs e)
        {
            if(string.IsNullOrWhiteSpace(nickname.Text) || string.IsNullOrWhiteSpace(email.Text) || string.IsNullOrWhiteSpace(password.Text))
            {
                MessageBox.Show("Nickname, email nor password can be blank!");
                return;
            }

            if (UsersList.Any(user => user.Nickname == nickname.Text))
            {
                MessageBox.Show("Nickname already in database!");
                return;
            }

            if (UsersList.Any(user => user.Email == email.Text))
            {
                MessageBox.Show("Email already in database!");
                return;
            }

            UsersList.Add(new UsersDB(nickname.Text, email.Text));
            Rows.Items.Add(nickname.Text);
        }

        private void saveButton_Click(object sender, EventArgs e)
        {
            if (Rows.SelectedIndex < 0)
            {
                MessageBox.Show("Need to select an item first to delete it!");
                return;
            }

            if (string.IsNullOrWhiteSpace(nickname.Text) || string.IsNullOrWhiteSpace(email.Text))
            {
                MessageBox.Show("Nickname and email can't be blank!");
                return;
            }

            UsersList[Rows.SelectedIndex] = new UsersDB(nickname.Text, email.Text);
            Rows.Items[Rows.SelectedIndex] = nickname.Text;

        }

        private void deleteButton_Click(object sender, EventArgs e)
        {
            if (Rows.SelectedIndex < 0)
            {
                MessageBox.Show("Need to select an item first to delete it!");
                return;
            }

            UsersList.RemoveAt(Rows.SelectedIndex);
            Rows.Items.RemoveAt(Rows.SelectedIndex);

            nickname.Clear();
            email.Clear();
            password.Clear();
        }

        private void listallButton_Click(object sender, EventArgs e)
        {

        }
    }

    public class UsersDB
    {
        public string Nickname { get; set; }
        public string Email { get; set; }

        public UsersDB(string nickname, string email)
        {
            Nickname = nickname;
            Email = email;
        }

    }
}
