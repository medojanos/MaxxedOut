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

namespace admin
{
    public partial class Muscle_groups : Form
    {
        private Database db;
        private List<MuscleGroupsDB> MGList = new List<MuscleGroupsDB>();

        public Muscle_groups()
        {
            InitializeComponent();

            db = new Database(@"Data source=D:\Projektek\MaxxedOut\MaxxedOut\api\db\maxxedout.db");
            var musclegroups = db.Query("SELECT * FROM muscle_groups;");

            foreach (DataRow mg in musclegroups.Rows)
            {
                MuscleGroupsDB MGObj = new MuscleGroupsDB(int.Parse(mg["id"].ToString()), mg["name"].ToString());
                MGList.Add(MGObj);
                Rows.Items.Add(MGObj);
            }

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
            Rows.Items.Clear();
            name.Clear();

            if (string.IsNullOrWhiteSpace(search.Text))
            {
                foreach(var mg in MGList)
                {
                    Rows.Items.Add(mg);
                }
            }
            else
            {
                foreach(var mg in MGList.Where(musclegroup => musclegroup.Name.Contains(search.Text)))
                {
                    Rows.Items.Add(mg);
                }
            }
        }

        private void Rows_SelectedIndexChanged(object sender, EventArgs e)
        {
            if(Rows.SelectedItem == null) return;

            MuscleGroupsDB mgObj = Rows.SelectedItem as MuscleGroupsDB;

            if(mgObj == null) return;

            name.Text = mgObj.Name;
        }

        private void addButton_Click(object sender, EventArgs e)
        {
            if(string.IsNullOrWhiteSpace(name.Text))
            {
                MessageBox.Show("Name can't be blank!");
                return;
            }

            if(MGList.Any(musclegroup => musclegroup.Name == name.Text))
            {
                MessageBox.Show("Muscle group already in database!");
                return;
            }

            var result = db.Query($@"INSERT INTO muscle_groups (name) VALUES ('{name.Text}') RETURNING id");
            var id = int.Parse(result.Rows[0]["id"].ToString());

            MuscleGroupsDB mgObj = new MuscleGroupsDB(id, name.Text);

            Rows.Items.Add(mgObj);
            MGList.Add(mgObj);
        }

        private void saveButton_Click(object sender, EventArgs e)
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

            mgObj.Name = name.Text;

            Rows.Items[Rows.SelectedIndex] = mgObj;

            db.Execute($"UPDATE muscle_groups SET name='{mgObj.Name}' WHERE id={mgObj.ID}");
        }

        private void deleteButton_Click(object sender, EventArgs e)
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

            MGList.Remove(mgObj);
            Rows.Items.Remove(mgObj);

            name.Clear();

            db.Execute($"DELETE FROM muscle_groups WHERE id='{mgObj.ID}'");
        }
    }

    public class MuscleGroupsDB
    {
        public int ID { get; set; }
        public string Name { get; set; }

        public MuscleGroupsDB(int id, string name)
        {
            ID = id;
            Name = name;
        }

        public override string ToString()
        {
            return Name;
        }
    }
}
