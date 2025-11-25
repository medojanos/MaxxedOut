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
        private BindingList<MuscleGroupsDB> MGList = MuscleGroupsList.MuscleGroups;
        private BindingSource mgSource = new BindingSource();

        public Muscle_groups()
        {
            InitializeComponent();

            db = new Database($@"Data Source=D:\Projektek\MaxxedOut\MaxxedOut\api\db\maxxedout.db");

            mgSource.DataSource = MGList;
            Rows.DataSource = mgSource;
            Rows.DisplayMember = "Name";
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
            name.Clear();

            if (string.IsNullOrWhiteSpace(search.Text))
            {
                mgSource.DataSource = MGList;
            }
            else
            {
                mgSource.DataSource = MGList.Where(musclegroup => musclegroup.Name.ToLower().Contains(search.Text.ToLower())).ToList();
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

            Rows.DisplayMember = null;
            Rows.DisplayMember = "Name";

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

            name.Clear();

            db.Execute($"DELETE FROM muscle_groups WHERE id='{mgObj.ID}'");
        }

        private void search_TextChanged(object sender, EventArgs e)
        {

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
