using admin.Models;
using System;
using System.Collections;
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
    public partial class Home : Form
    {
        public Home()
        {
            this.Load += Home_load;
            InitializeComponent();
        }

        public async void Home_load(object sender, EventArgs e)
        {
            MuscleGroupsList.MuscleGroups = await ApiClient.SafeGet<BindingList<MuscleGroupsDB>>("/muscle_groups");
        }

        // Data handling

        private void muscleGroupsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            new Muscle_groups().Show();
        }

        private void usersToolStripMenuItem_Click(object sender, EventArgs e)
        {
            new Users().Show();
        }

        private void exercisesToolStripMenuItem_Click(object sender, EventArgs e)
        {
            new Exercises().Show();
        }

        // Exit

        private void exitToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }
    }
}
