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
            var result = await ApiClient.Get<List<UsersDB>>("/users/admin");
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
            if(string.IsNullOrWhiteSpace(nickname.Text) || string.IsNullOrWhiteSpace(email.Text.Trim()) || string.IsNullOrWhiteSpace(password.Text.Trim()))
            {
                MessageBox.Show("Nickname, email nor password can be blank!");
                return;
            }

            if (UsersList.Any(user => user.Email == email.Text.Trim()))
            {
                MessageBox.Show("Email already in database!");
                return;
            }

            if (!UsersDB.IsPwdValid(password.Text) || !UsersDB.IsEmailValid(email.Text))
            {
                MessageBox.Show("Invalid email or password!");
                return;
            }


            var result = await ApiClient.Post<object, JsonElement>("/users/admin", new {
                nickname = nickname.Text.Trim(),
                email = email.Text.Trim(),
                password = password.Text.Trim()
            });

            if (result.ValueKind != JsonValueKind.Undefined)
            {
                var userObj = new UsersDB(result.GetProperty("id").GetInt32(), nickname.Text.Trim(), email.Text.Trim(), password.Text.Trim());

                MessageBox.Show($"{userObj.Nickname} added succesfully!");

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

            if (string.IsNullOrWhiteSpace(nickname.Text) || string.IsNullOrWhiteSpace(email.Text))
            {
                MessageBox.Show("Nickname and email can't be blank!");
                return;
            }

            if (!UsersDB.IsEmailValid(email.Text.Trim()))
            {
                MessageBox.Show("Invalid email!");
                return;
            }

            if (UsersList.Any(user => user.Email == email.Text.Trim() && user.Id != userObj.Id))
            {
                MessageBox.Show("Email already in database!");
                return;
            }

            var result = await ApiClient.Put<object, bool>("/users/admin", new {
                nickname = nickname.Text.Trim(),
                email = email.Text.Trim(),
                password = string.IsNullOrWhiteSpace(password.Text) ? null : password.Text.Trim(),
                id = userObj.Id
            });

            if (result != false)
            {
                userObj.Email = email.Text.Trim();
                userObj.Nickname = nickname.Text.Trim();

                if (!string.IsNullOrWhiteSpace(password.Text.Trim()) && UsersDB.IsPwdValid(password.Text.Trim())) userObj.Password = password.Text.Trim();

                MessageBox.Show($"{userObj.Nickname} updated succesfully!");

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

            var result = await ApiClient.Delete<bool>($"/users/admin/{userObj.Id}");

            if (result != false)
            {
                UsersList.Remove(userObj);
                Rows.Items.Remove(userObj);

                MessageBox.Show($"{userObj.Nickname} deleted succesfully!");

                nickname.Clear();
                email.Clear();
                password.Clear();
            }
        }

        private void clearButton_Click(object sender, EventArgs e)
        {
            nickname.Clear();
            email.Clear();
            password.Clear();
            Rows.ClearSelected();
        }
    }
}
