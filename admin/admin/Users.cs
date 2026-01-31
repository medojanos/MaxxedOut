using admin.Classes;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlTypes;
using System.Drawing;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Net.Mail;
using System.Security.Cryptography;
using System.IO;

using static admin.ApiClient;
using admin.Models;
using System.Net.Http;
using System.Text.Json;

namespace admin
{
    public partial class Users : Form
    {
        private List<UsersDB> UsersList = new List<UsersDB>();
        public Users()
        {
            InitializeComponent();

            this.Load += Users_load;
        }

        private async void Users_load(object sender, EventArgs e)
        {
            var result = await ApiClient.SafeGet<List<UsersDB>>("/user/admin");
            if (result == null) return;

            UsersList = result;

            foreach (var user in UsersList)
            {
                Rows.Items.Add(user);
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
                foreach(var user in UsersList.Where(user => user.Nickname.Contains(search.Text.ToLower()) || user.Email.Contains(search.Text.ToLower())))
                {
                    Rows.Items.Add(user);
                }
            }
        }

        public void Rows_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (Rows.SelectedItem == null) return;

            UsersDB userObj = Rows.SelectedItem as UsersDB;

            if (userObj == null) return;

            nickname.Text = userObj.Nickname;
            email.Text = userObj.Email;
            password.Clear();
        }

        private async void addButton_Click(object sender, EventArgs e)
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

            if (!UsersDB.IsPwdValid(password.Text) || !UsersDB.IsEmailValid(email.Text))
            {
                return;
            }


            var result = await ApiClient.SafePost<object, ApiResult>("/user/admin", new {
                nickname = nickname.Text,
                email = email.Text,
                password = password.Text
            });

            if (ApiResult.ensureSuccess(result))
            {
                var userObj = new UsersDB(result.data.GetProperty("id").GetInt32(), nickname.Text, email.Text, password.Text);

                UsersList.Add(userObj);
                Rows.Items.Add(userObj);
            }
        }

        private async void saveButton_Click(object sender, EventArgs e)
        {
            if (Rows.SelectedIndex < 0)
            {
                MessageBox.Show("Need to select an item first to save it!");
                return;
            }

            UsersDB userObj = Rows.SelectedItem as UsersDB;

            if(userObj == null)
            {
                MessageBox.Show("Invalid item!");
                return;
            }

            if (string.IsNullOrWhiteSpace(nickname.Text) || string.IsNullOrWhiteSpace(email.Text))
            {
                MessageBox.Show("Nickname and email can't be blank!");
                return;
            }

            if (!UsersDB.IsEmailValid(email.Text))
            {
                return;
            }

            var result = await ApiClient.SafePut<object, ApiResult>("/user/admin", new {
                nickname = nickname.Text,
                email = email.Text,
                password = string.IsNullOrWhiteSpace(password.Text) ? null : password.Text,
                id = userObj.Id
            });

            if (ApiResult.ensureSuccess(result))
            {
                userObj.Email = email.Text;
                userObj.Nickname = nickname.Text;

                if (!string.IsNullOrWhiteSpace(password.Text) && UsersDB.IsPwdValid(password.Text)) userObj.Password = password.Text;

                Rows.Items[Rows.SelectedIndex] = userObj;
            }
        }

        private async void deleteButton_Click(object sender, EventArgs e)
        {
            if (Rows.SelectedIndex < 0)
            {
                MessageBox.Show("Need to select an item first to delete it!");
                return;
            }

            UsersDB userObj = Rows.SelectedItem as UsersDB;

            if (userObj == null)
            {
                MessageBox.Show("Invalid item!");
                return;
            }

            var result = await ApiClient.SafeDelete<ApiResult>($"/user/admin/{userObj.Id}");

            if (ApiResult.ensureSuccess(result))
            {
                UsersList.Remove(userObj);
                Rows.Items.Remove(userObj);

                nickname.Clear();
                email.Clear();
                password.Clear();
            }
        }
    }
}
