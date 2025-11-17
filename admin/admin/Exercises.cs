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
        public Exercises()
        {
            InitializeComponent();

            // Database

            Database db = new Database(@"Data source=D:\Projektek\MaxxedOut\MaxxedOut\api\db\maxxedout.db");
            var exercises = db.Query("SELECT * FROM exercises;");

            foreach(DataRow exercise in exercises.Rows)
            {
                Rows.Items.Add(exercise["name"].ToString());
            }
        }

        private void Rows_SelectedIndexChanged(object sender, EventArgs e)
        {
            
        }

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

        private void exerciseName_TextChanged(object sender, EventArgs e)
        {

        }

    }

    public class ExercisesDB
    {
        public string Exercise { get; set; }
        public string Type { get; set; }
        public ListBox Musclesworked { get; set; }
    }
}
