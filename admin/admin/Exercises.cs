using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using admin.Classes;

using static System.Windows.Forms.VisualStyles.VisualStyleElement.ListView;
using static admin.ApiClient;
using admin.Models;
using System.Net.Http;
using System.Text.Json;


namespace admin
{
    public partial class Exercises : Form
    {
        private List<ExercisesDB> ExercisesList = new List<ExercisesDB>();
        public Exercises()
        {
            InitializeComponent();

            this.Load += Exercises_load;
        }

        private async void Exercises_load(object sender, EventArgs e)
        {
            ExercisesList = await ApiClient.SafeGet<List<ExercisesDB>>("/exercises/admin");
            ExercisesList.ForEach(exercise => Rows.Items.Add(exercise));

            musclegroups.DataSource = MuscleGroupsList.MuscleGroups;
            musclegroups.DisplayMember = "Name";
            musclegroups.ValueMember = "ID";

            type.Items.Add("Compound");
            type.Items.Add("Isolation");

            role.Items.Add("Primary");
            role.Items.Add("Secondary");
        }

        // Navigation handling

        private void exitToolStripMenuItem_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void usersToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Users UsersForm = new Users();
            UsersForm.Show();
        }

        private void mescleGroupsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Muscle_groups MusclegroupsForm = new Muscle_groups();
            MusclegroupsForm.ShowDialog();
        }

        // Data handling

        private void Rows_SelectedIndexChanged(object sender, EventArgs e)
        {
            Musclesworked.Items.Clear();
            Musclesworked.SelectedItem = null;
            role.SelectedItem = null;
            musclegroups.SelectedItem = null;

            ExercisesDB exerciseObj = Rows.SelectedItem as ExercisesDB;

            if (exerciseObj == null)
            {
                MessageBox.Show("Invalid item!");
                return;
            }

            exercise.Text = exerciseObj.Name;
            type.SelectedItem = exerciseObj.Type;

            foreach (var mg in exerciseObj.Musclesworked)
            {
                Musclesworked.Items.Add(mg);
            }
        }

        private void Musclesworked_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (Musclesworked.SelectedItem == null)
            {
                musclegroups.SelectedItem = null;
                role.SelectedItem= null;
                return;
            }

            MusclesworkedDB selectedMuscleworked = Musclesworked.SelectedItem as MusclesworkedDB;
            musclegroups.SelectedItem = selectedMuscleworked.Musclegroup;
            role.SelectedItem = selectedMuscleworked.Role;
        }

        private void searchButton_Click(object sender, EventArgs e)
        {
            Rows.Items.Clear();

            if (string.IsNullOrWhiteSpace(search.Text))
            {
                foreach (var exercise in ExercisesList)
                {
                    Rows.Items.Add(exercise);
                }
            }
            else
            {
                foreach (var exercise in ExercisesList.Where(ex => ex.Name.ToLower().Contains(search.Text.ToLower()) || ex.Type.ToLower().Contains(search.Text.ToLower()) || ex.Musclesworked.Any(mg => mg.Musclegroup.Name.ToLower().Contains(search.Text.ToLower()))))
                {
                    Rows.Items.Add(exercise);
                }
            }
        }

        private async void addmuscleworkedButton_Click(object sender, EventArgs e)
        {
            MuscleGroupsDB mgObj = musclegroups.SelectedItem as MuscleGroupsDB;

            foreach (MusclesworkedDB mgworked in Musclesworked.Items)
            {
                if (mgworked.Musclegroup.Name == mgObj.Name)
                {
                    MessageBox.Show("Can't add a muscle worked twice!");
                    return;
                }
            }

            if (role.SelectedItem == null || musclegroups.SelectedItem == null)
            {
                MessageBox.Show("Must choose muscle group and role before adding!");
                return;
            }

            if(Rows.SelectedItem != null)
            {
                ExercisesDB Exercise = Rows.SelectedItem as ExercisesDB;

                var obj = new {
                    muscleGroupId = mgObj.Id,
                    exerciseId = Exercise.Id, 
                    role = role.Text 
                };

                var result = await ApiClient.SafePost<object, ApiResult>("/admin/musclegroup", obj);
                ApiResult.ensureSuccess(result);
            }

            MusclesworkedDB mgworkedObj = new MusclesworkedDB(mgObj, role.Text);
            Musclesworked.Items.Add(mgworkedObj);
        }

        private async void savemuscleworkedButton_Click(object sender, EventArgs e)
        {
            MusclesworkedDB mgworkedObj = Musclesworked.SelectedItem as MusclesworkedDB;

            if (mgworkedObj == null)
            {
                MessageBox.Show("Must select a musclegroup first to save it!");
                return;
            }

            MuscleGroupsDB mgObj = musclegroups.SelectedItem as MuscleGroupsDB;

            if (mgworkedObj.Musclegroup.Name != mgObj.Name)
            {
                MessageBox.Show("Can't save if the muscle group is not the same!");
                return;
            }

            if (role.SelectedItem == null || musclegroups.SelectedItem == null)
            {
                MessageBox.Show("Must choose muscle group and role before saving!");
                return;
            }

            if (Rows.SelectedItem != null)
            {
                ExercisesDB Exercise = Rows.SelectedItem as ExercisesDB;

                var obj = new
                {
                    muscleGroupId = mgObj.Id,
                    exerciseId = Exercise.Id,
                    role = role.Text
                };

                var result = await ApiClient.SafePut<object, ApiResult>("admin/musclegroup", obj);
                ApiResult.ensureSuccess(result);
            }

            mgworkedObj.Role = role.Text;
        }

        private async void deletemuscleworkedButton_Click(object sender, EventArgs e)
        {
            MusclesworkedDB mgworkedObj = Musclesworked.SelectedItem as MusclesworkedDB;

            if (mgworkedObj == null)
            {
                MessageBox.Show("Must select a musclegroup first to delete it!");
                return;
            }

            Musclesworked.Items.Remove(mgworkedObj);

            if (Rows.SelectedItem != null)
            {
                ExercisesDB Exercise = Rows.SelectedItem as ExercisesDB;

                var result = await ApiClient.SafeDeleteWithBody<object, ApiResult>("admin/musclegroup", new {
                    muscleGroupId = mgworkedObj.Musclegroup.Id,
                    exerciseId = Exercise.Id
                });
                ApiResult.ensureSuccess(result);
            }

            Musclesworked.SelectedItem = null;
        }

        private async void addButton_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(exercise.Text) || string.IsNullOrWhiteSpace(type.Text) || Musclesworked.Items.Count == 0)
            {
                MessageBox.Show("Every field needs to be filled!");
                return;
            }

            if (ExercisesList.Any(ex => ex.Name == exercise.Text))
            {
                MessageBox.Show("Can't add an exercise twice!");
                return;
            }

            var result = await ApiClient.SafePost<object, ApiResult>("exercises/admin", new {
                    name = exercise.Text,
                    type = type.Text,
                    musclesworked = Musclesworked.Items.Cast<MusclesworkedDB>().Select(mgworked => new {
                        muscleGroupId = mgworked.Musclegroup.Id,
                        role = mgworked.Role
                    }).ToList()
                }
            );

            ApiResult.ensureSuccess(result);


            ExercisesDB exerciseObj = new ExercisesDB
            {
                Id = Convert.ToInt32(result.data),
                Name = exercise.Text,
                Type = type.Text,
                Musclesworked = Musclesworked.Items.Cast<MusclesworkedDB>().ToList()
            };

            Rows.Items.Add(exerciseObj);
        }

        private async void saveButton_Click(object sender, EventArgs e)
        {
            ExercisesDB ExerciseObj = Rows.SelectedItem as ExercisesDB;

            if (ExerciseObj == null)
            {
                MessageBox.Show("Need to select an exercise to save it!");
                return;
            }

            if (string.IsNullOrWhiteSpace(exercise.Text) || string.IsNullOrWhiteSpace(type.Text) || Musclesworked.Items.Count == 0)
            {
                MessageBox.Show("Every field needs to be filled!");
                return;
            }

            var result = await ApiClient.SafePut<object, ApiResult>($"/admin/exercises", new {
                id = ExerciseObj.Id,
                name = exercise.Text,
                type = type.Text,
                musclesworked = Musclesworked.Items.Cast<MusclesworkedDB>().
                    Select(mgworked => new {
                        muscleGroupId = mgworked.Musclegroup.Id,
                        role = mgworked.Role
                    }).ToList()
            });
            ApiResult.ensureSuccess(result);


            ExerciseObj.Musclesworked = Musclesworked.Items.Cast<MusclesworkedDB>().ToList();
            ExerciseObj.Name = exercise.Text;
            ExerciseObj.Type = type.Text;
        }

        private async void deleteButton_Click(object sender, EventArgs e)
        {
            ExercisesDB Exercise = Rows.SelectedItem as ExercisesDB;

            if (Exercise == null)
            {
                MessageBox.Show("Need to select an exercise to delete it!");
                return;
            }

            var result = await ApiClient.SafeDelete<ApiResult>($"/exercises/admin/:{Exercise.Id}");
            ApiResult.ensureSuccess(result);

            ExercisesList.Remove(Exercise);
            Rows.Items.Remove(Exercise);
        }
    }
}
