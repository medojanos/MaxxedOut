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
    public partial class Home : Form
    {
        public Home()
        {
            InitializeComponent();
        }

        private void muscleGroupsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            new Muscle_groups().Show();
        }

        private void usersToolStripMenuItem_Click(object sender, EventArgs e)
        {
            new Users().Show();
        }

        private void exitToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void exercisesToolStripMenuItem_Click(object sender, EventArgs e)
        {
            new Exercises().Show();
        }

        private void usersToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            new Users().Show();
        }

        private void exitToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }
    }
}
