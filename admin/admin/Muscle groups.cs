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
                mgSource.DataSource = MGList.Where(musclegroup => musclegroup.name.ToLower().Contains(search.Text.ToLower())).ToList();
            }
        }

        private void Rows_SelectedIndexChanged(object sender, EventArgs e)
        {
            if(Rows.SelectedItem == null) return;

            MuscleGroupsDB mgObj = Rows.SelectedItem as MuscleGroupsDB;

            if(mgObj == null) return;

            name.Text = mgObj.name;
        }

        private async void addButton_Click(object sender, EventArgs e)
        {
            if(string.IsNullOrWhiteSpace(name.Text))
            {
                MessageBox.Show("Name can't be blank!");
                return;
            }

            if(MGList.Any(musclegroup => musclegroup.name == name.Text))
            {
                MessageBox.Show("Muscle group already in database!");
                return;
            }

            var mgObj = new MuscleGroupsDB
            {
                name = name.Text
            };

            var result = await ApiClient.Post<MuscleGroupsDB, ApiResult>("muscle_groups/admin", mgObj);
            ApiResult.ensureSuccess(result);

            mgObj.id = Convert.ToInt32(result.data["id"]);

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

            mgObj.name = name.Text;

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

            var result = await ApiClient.SafeDelete<object, ApiResult>("muscle_groups/admin", new { id = mgObj.id });
            ApiResult.ensureSuccess(result);

            MGList.Remove(mgObj);
            name.Clear();
        }
    }
}
