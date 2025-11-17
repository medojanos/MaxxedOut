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
            Database db = new Database(@"Data source=C:\Users\tekeresdenes\repos\MaxxedOut\api\db\maxxedout.db");
            var exercises = db.Query("SELECT * FROM exercises;");

            foreach(DataRow exercise in exercises.Rows)
            {
                Rows.Items.Add(exercise["name"].ToString());
            }
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
    }
}
