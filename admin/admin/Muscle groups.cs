using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Data.SqlTypes;
using System.IO;

using static admin.ApiClient;
using admin.Models;
using System.Net.Http;
using System.Text.Json;

namespace admin
{
    public partial class Muscle_groups : Form
    {
        private BindingList<MuscleGroupsDB> MGList = MuscleGroupsList.MuscleGroups;
        private BindingSource mgSource = new BindingSource();

        public Muscle_groups()
        {
            InitializeComponent();

            this.Load += Muscle_groups_load;
            
        }
        private async void Muscle_groups_load(object sender, EventArgs e)
        {
            MGList = await ApiClient.SafeGet<BindingList<MuscleGroupsDB>>("/muscle_groups");

            mgSource.DataSource = MGList;
            Rows.DataSource = mgSource;
            Rows.DisplayMember = "name";
        }

        // Navigation handling

        private void exercisesToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Exercises ExercisesForm = new Exercises();
            ExercisesForm.ShowDialog();
        }

        private void usersToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Users UsersForm = new Users();
            UsersForm.Show();
        }

        private void exitToolStripMenuItem_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        // Data handling

        private void searchButton_Click(object sender, EventArgs e)
        {
            name.Clear();

            if (string.IsNullOrWhiteSpace(search.Text))
            {
                mgSource.DataSource = MGList;
            }
            else
            {
                mgSource.DataSource = MGList.Where(musclegroup => musclegroup.Name.ToLower().Contains(search.Text.ToLower())).ToList();
            }
        }

        private void Rows_SelectedIndexChanged(object sender, EventArgs e)
        {
            if(Rows.SelectedItem == null) return;

            MuscleGroupsDB mgObj = Rows.SelectedItem as MuscleGroupsDB;

            if(mgObj == null) return;

            name.Text = mgObj.Name;
        }

        private async void addButton_Click(object sender, EventArgs e)
        {
            if(string.IsNullOrWhiteSpace(name.Text))
            {
                MessageBox.Show("Name can't be blank!");
                return;
            }

            if(MGList.Any(musclegroup => musclegroup.Name == name.Text))
            {
                MessageBox.Show("Muscle group already in database!");
                return;
            }

            var mgObj = new MuscleGroupsDB
            {
                Name = name.Text
            };

            var result = await ApiClient.SafePost<object, ApiResult>("muscle_groups/admin", new {
                name = name.Text
            });
            ApiResult.ensureSuccess(result);

            mgObj.Id = Convert.ToInt32(result.data);

            MGList.Add(mgObj);
        }

        private async void saveButton_Click(object sender, EventArgs e)
        {
            if (Rows.SelectedIndex < 0)
            {
                MessageBox.Show("Need to select an item first to save it!");
                return;
            }

            if (string.IsNullOrWhiteSpace(name.Text))
            {
                MessageBox.Show("Name can't be blank!");
                return;
            }

            MuscleGroupsDB mgObj = Rows.SelectedItem as MuscleGroupsDB;

            if (mgObj == null)
            {
                MessageBox.Show("Invalid item!");
                return;
            }

            mgObj.Name = name.Text;

            Rows.DisplayMember = null;
            Rows.DisplayMember = "name";

            var result = await ApiClient.SafePut<MuscleGroupsDB, ApiResult>("muscle_groups/admin", mgObj);
            ApiResult.ensureSuccess(result);
        }

        private async void deleteButton_Click(object sender, EventArgs e)
        {
            if (Rows.SelectedIndex < 0)
            {
                MessageBox.Show("Need to select an item first to delete it!");
                return;
            }

            MuscleGroupsDB mgObj = Rows.SelectedItem as MuscleGroupsDB;

            if (mgObj == null)
            {
                MessageBox.Show("Invalid item!");
                return;
            }

            var result = await ApiClient.SafeDelete<ApiResult>($"muscle_groups/admin/{mgObj.Id}");
            ApiResult.ensureSuccess(result);

            MGList.Remove(mgObj);
            name.Clear();
        }
    }
}
