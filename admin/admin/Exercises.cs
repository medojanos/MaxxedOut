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

namespace admin
{
    public partial class Exercises : Form
    {
        private Database db;
        private List<ExercisesDB> ExercisesList = new List<ExercisesDB>();
        public Exercises()
        {
            InitializeComponent();

            string solutionRoot = Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).Parent.Parent.Parent.Parent.Parent.FullName;
            string dbPath = Path.Combine(solutionRoot, "api", "db", "maxxedout.db");

            db = new Database($@"Data Source={dbPath}");

            var exercises = db.Query("SELECT * FROM exercises;");

            foreach (DataRow exercise in exercises.Rows)
            {
                var muscle_groups_exercises = db.Query($@"SELECT * FROM muscle_groups_exercises WHERE exercises_id={int.Parse(exercise["id"].ToString())}");
                List<MusclesworkedDB> MusclesworkedList = new List<MusclesworkedDB>();
                 
                foreach (DataRow mg_ex in muscle_groups_exercises.Rows)
                {
                    MusclesworkedDB mgworked = new MusclesworkedDB(MuscleGroupsList.MuscleGroups.FirstOrDefault(mg => mg.ID == int.Parse(mg_ex["muscle_groups_id"].ToString())), mg_ex["role"].ToString());
                    MusclesworkedList.Add(mgworked);
                }

                ExercisesDB exerciseObj = new ExercisesDB(int.Parse(exercise["id"].ToString()), exercise["name"].ToString(), exercise["type"].ToString(), MusclesworkedList);

                Rows.Items.Add(exerciseObj);
                ExercisesList.Add(exerciseObj);
            }

            musclegroups.DataSource = MuscleGroupsList.MuscleGroups;
            musclegroups.DisplayMember = "Name";
            musclegroups.ValueMember = "ID";

            type.Items.Add("Compound");
            type.Items.Add("Isolation");

            role.Items.Add("Primary");
            role.Items.Add("Secondary");
            role.Items.Add("Stabilizer");
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

            exercise.Text = exerciseObj.Exercise;
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
            musclegroups.SelectedItem = selectedMuscleworked.MuscleGroup;
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
                foreach (var exercise in ExercisesList.Where(ex => ex.Exercise.ToLower().Contains(search.Text.ToLower()) || ex.Type.ToLower().Contains(search.Text.ToLower()) || ex.Musclesworked.Any(mg => mg.MuscleGroup.Name.ToLower().Contains(search.Text.ToLower()))))
                {
                    Rows.Items.Add(exercise);
                }
            }
        }

        private void addmuscleworkedButton_Click(object sender, EventArgs e)
        {
            MuscleGroupsDB mgObj = musclegroups.SelectedItem as MuscleGroupsDB;

            foreach (MusclesworkedDB mgworked in Musclesworked.Items)
            {
                if (mgworked.MuscleGroup.Name == mgObj.Name)
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

            MusclesworkedDB mgworkedObj = new MusclesworkedDB(mgObj, role.Text);
            Musclesworked.Items.Add(mgworkedObj);

            ExercisesDB Exercise = Rows.SelectedItem as ExercisesDB;

            if(Rows.SelectedItem != null)
            {
                db.Execute($@"INSERT INTO muscle_groups_exercises (muscle_groups_id, exercises_id, role) VALUES ('{mgworkedObj.MuscleGroup.ID}', '{Exercise.ID}', '{role.Text}')");
            }
        }

        private void savemuscleworkedButton_Click(object sender, EventArgs e)
        {
            MusclesworkedDB mgworkedObj = Musclesworked.SelectedItem as MusclesworkedDB;

            if (mgworkedObj == null)
            {
                MessageBox.Show("Must select a musclegroup first to save it!");
                return;
            }

            MuscleGroupsDB mgObj = musclegroups.SelectedItem as MuscleGroupsDB;

            if (mgworkedObj.MuscleGroup.Name != mgObj.Name)
            {
                MessageBox.Show("Can't save if the muscle group is not the same!");
                return;
            }

            if (role.SelectedItem == null || musclegroups.SelectedItem == null)
            {
                MessageBox.Show("Must choose muscle group and role before adding!");
                return;
            }

            mgworkedObj.Role = role.Text;

            if (Rows.SelectedItem != null)
            {
                ExercisesDB Exercise = Rows.SelectedItem as ExercisesDB;
                db.Execute($@"UPDATE muscle_groups_exercises SET role = '{role.Text}' WHERE muscle_groups_id = '{mgworkedObj.MuscleGroup.ID}' AND exercises_id = '{Exercise.ID}';");
            }
        }

        private void deletemuscleworkedButton_Click(object sender, EventArgs e)
        {
            MusclesworkedDB mgworkedObj = Musclesworked.SelectedItem as MusclesworkedDB;

            if (mgworkedObj == null)
            {
                MessageBox.Show("Must select a musclegroup first to delete it!");
                return;
            }

            Musclesworked.Items.Remove(mgworkedObj);

            ExercisesDB Exercise = Rows.SelectedItem as ExercisesDB;

            if (Rows.SelectedItem != null)
            {
                db.Execute($@"DELETE FROM muscle_groups_exercises WHERE muscle_groups_id = '{mgworkedObj.MuscleGroup.ID}' AND exercises_id = '{Exercise.ID}';");
            }

            Musclesworked.SelectedItem = null;
        }

        private void addButton_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(exercise.Text) || string.IsNullOrWhiteSpace(type.Text) || Musclesworked.Items.Count == 0)
            {
                MessageBox.Show("Every field needs to be filled!");
                return;
            }

            if (ExercisesList.Any(ex => ex.Exercise == exercise.Text))
            {
                MessageBox.Show("Can't add an exercise twice!");
                return;
            }

            var result = db.Query($@"INSERT INTO exercises (name, type) VALUES ('{exercise.Text}', '{type.Text}') RETURNING id;");
            int id = int.Parse(result.Rows[0]["id"].ToString());

            List<MusclesworkedDB> mgworkedList = new List<MusclesworkedDB>();

            foreach (MusclesworkedDB mgworked in Musclesworked.Items)
            {
                mgworkedList.Add(mgworked);
                db.Execute($@"INSERT INTO muscle_groups_exercises (muscle_groups_id, exercises_id, role) VALUES ('{mgworked.MuscleGroup.ID}', '{id}', '{mgworked.Role}')");
            }

            ExercisesDB exerciseObj = new ExercisesDB(id, exercise.Text, type.Text, mgworkedList);
            ExercisesList.Add(exerciseObj);
            Rows.Items.Add(exerciseObj);
        }

        private void saveButton_Click(object sender, EventArgs e)
        {
            ExercisesDB Exercise = Rows.SelectedItem as ExercisesDB;

            if (Exercise == null)
            {
                MessageBox.Show("Need to select an exercise to save it!");
                return;
            }

            if (string.IsNullOrWhiteSpace(exercise.Text) || string.IsNullOrWhiteSpace(type.Text) || Musclesworked.Items.Count == 0)
            {
                MessageBox.Show("Every field needs to be filled!");
                return;
            }

            db.Execute($@"DELETE FROM muscle_groups_exercises WHERE exercises_id = '{Exercise.ID}'");

            List<MusclesworkedDB> mgworkedList = new List<MusclesworkedDB>();

            foreach (MusclesworkedDB mgworkedObj in Musclesworked.Items)
            {
                mgworkedList.Add(mgworkedObj);
                db.Execute($@"INSERT INTO muscle_groups_exercises (muscle_groups_id, exercises_id, role) VALUES ('{mgworkedObj.MuscleGroup.ID}', '{Exercise.ID}', '{mgworkedObj.Role}');");
            }

            Exercise.Exercise = exercise.Text;
            Exercise.Type = type.Text;
            Exercise.Musclesworked = mgworkedList;

            db.Execute($@"UPDATE exercises SET name = '{Exercise.Exercise}', type = '{Exercise.Type}' WHERE id = '{Exercise.ID}';");
        }

        private void deleteButton_Click(object sender, EventArgs e)
        {
            ExercisesDB Exercise = Rows.SelectedItem as ExercisesDB;

            if (Exercise == null)
            {
                MessageBox.Show("Need to select an exercise to delete it!");
                return;
            }

            db.Execute($@"DELETE FROM muscle_groups_exercises WHERE exercises_id = '{Exercise.ID}'");

            ExercisesList.Remove(Exercise);
            Rows.Items.Remove(Exercise);
            db.Execute($@"DELETE FROM exercises WHERE id = '{Exercise.ID}';");
        }
    }

    public class ExercisesDB
    {
        public int ID { get; set; }
        public string Exercise { get; set; }
        public string Type { get; set; }
        public List<MusclesworkedDB> Musclesworked { get; set; }

        public ExercisesDB(int id, string exercise, string type, List<MusclesworkedDB> musclesworked)
        {
            ID = id;
            Exercise = exercise;
            Type = type;
            Musclesworked = musclesworked;
        }

        public override string ToString()
        {
            return Exercise;
        }
    }

    public class MusclesworkedDB
    {
        public MuscleGroupsDB MuscleGroup { get; set; }
        public string Role { get; set; }

        public MusclesworkedDB(MuscleGroupsDB musclegroup, string role)
        {
            MuscleGroup = musclegroup;
            Role = role;
        }

        public override string ToString()
        {
            return MuscleGroup.Name;
        }
    }
}
