using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace admin
{
    public partial class Users : Form
    {
        private Database db;
        public Users()
        {
            InitializeComponent();

            db = new Database(@"Data source=C:\Users\tekeresdenes\repos\MaxxedOut\api\db\maxxedout.db");
            var users = db.Query("SELECT * FROM users;");

            foreach (DataRow user in users.Rows)
            {
                Rows.Items.Add(user["nickname"].ToString());
            }

        }

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

        private void searchButton_Click(object sender, EventArgs e)
        {

        }

        public void Rows_SelectedIndexChanged(object sender, EventArgs e)
        {
            string username = Rows.SelectedItem.ToString();
            var selectedUser = db.Query($"SELECT * FROM users WHERE username = {username} LIMIT 1");
        }
    }
}
