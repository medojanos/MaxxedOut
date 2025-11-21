using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace admin
{
    public partial class Exercises : Form
    {
        private Database db;
        private List<MusclesworkedDB> MusclesworkedList = new List<MusclesworkedDB>();
        private List<ExercisesDB> ExercisesList = new List<ExercisesDB>();
        public Exercises()
        {
            InitializeComponent();

            db = new Database(@"Data source=D:\Projektek\MaxxedOut\MaxxedOut\api\db\maxxedout.db");
            var exercises = db.Query("SELECT * FROM exercises;");

            foreach (DataRow exercise in exercises.Rows)
            {
                var muscle_groups_exercises = db.Query($@"SELECT * FROM muscle_groups_exercises WHERE exercise_id={int.Parse(exercise["id"].ToString())}");
                 
                foreach (DataRow mg_ex in muscle_groups_exercises.Rows)
                {
                    MusclesworkedDB mgworked = new MusclesworkedDB(int.Parse(mg_ex["muscle_group_id"].ToString()), mg_ex["role"].ToString());
                    MusclesworkedList.Add(mgworked);

                }

                ExercisesDB exerciseObj = new ExercisesDB(exercise["name"].ToString(), exercise["id"].ToString(), MusclesworkedList);

                Rows.Items.Add(exerciseObj);
                ExercisesList.Add(exerciseObj);
            }

            musclegroups.DataSource = MuscleGroupsList.MuscleGroups;
            musclegroups.DisplayMember = "Name";
            musclegroups.ValueMember = "ID";

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

            MusclesworkedDB mgworkedObj = new MusclesworkedDB(mgObj.ID, role.Text);
            MusclesworkedList.Add(mgworkedObj);

            if(Rows.SelectedItem != null)
            {
                // db.Execute($@"INSERT INTO muscle_groups_exercises (muscle_group_id, exercise_id, role) VALUES ('{mgObj.ID}', '{Rows.SelectedItem.ID}', '{role.Text}')");
            }
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
        public string Exercise { get; set; }
        public string Type { get; set; }
        public List<MusclesworkedDB> Musclesworked { get; set; }

        public ExercisesDB(string exercise, string type, List<MusclesworkedDB> musclesworked)
        {
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
        public int ID { get; set; }
        public string Role { get; set; }

        public MusclesworkedDB(int id,string role)
        {
            ID = id;
            Role = role;
        }
    }
}
