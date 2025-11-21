using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace admin
{
    public partial class Exercises : Form
    {
        private Database db;
        private List<ExercisesDB> ExercisesList = new List<ExercisesDB>();
        public Exercises()
        {
            InitializeComponent();

            db = new Database(@"Data source=D:\Projektek\MaxxedOut\MaxxedOut\api\db\maxxedout.db");
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
                Musclesworked.Items.Add(mg.MuscleGroup);
            }
        }

        private void Musclesworked_SelectedIndexChanged(object sender, EventArgs e)
        {
            MuscleGroupsDB selectedMusclegroup = Musclesworked.SelectedItem as MuscleGroupsDB;
            // itt kő folytatni
        }

        private void searchButton_Click(object sender, EventArgs e)
        {

        }

        private void addmuscleworkedButton_Click(object sender, EventArgs e)
        {
            MuscleGroupsDB mgObj = musclegroups.SelectedItem as MuscleGroupsDB;

            if (Musclesworked.Items.Contains(mgObj))
            {
                MessageBox.Show("Can't add a muscle worked twice!");
                return;
            }

            if (role.SelectedItem == null || musclegroups.SelectedItem == null)
            {
                MessageBox.Show("Must choose muscle group and role before adding!");
                return;
            }

            Musclesworked.Items.Add(mgObj);

            MusclesworkedDB mgworkedObj = new MusclesworkedDB(mgObj, role.Text);

            if(Rows.SelectedItem != null)
            {
                // db.Execute($@"INSERT INTO muscle_groups_exercises (muscle_group_id, exercise_id, role) VALUES ('{mgObj.ID}', '{Rows.SelectedItem.ID}', '{role.Text}')");
            }
        }

        private void savemuscleworkedButton_Click(object sender, EventArgs e)
        {

        }

        private void deletemuscleworkedButton_Click(object sender, EventArgs e)
        {

        }

        private void addButton_Click(object sender, EventArgs e)
        {

        }

        private void saveButton_Click(object sender, EventArgs e)
        {

        }

        private void deleteButton_Click(object sender, EventArgs e)
        {

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
    }
}
