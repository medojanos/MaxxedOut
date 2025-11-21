namespace admin
{
    partial class Exercises
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.Menu = new System.Windows.Forms.MenuStrip();
            this.fileToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.usersToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.mescleGroupsToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.exitToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.Rows = new System.Windows.Forms.ListBox();
            this.search = new System.Windows.Forms.TextBox();
            this.searchButton = new System.Windows.Forms.Button();
            this.deleteButton = new System.Windows.Forms.Button();
            this.saveButton = new System.Windows.Forms.Button();
            this.addButton = new System.Windows.Forms.Button();
            this.musclegroupsLabel = new System.Windows.Forms.Label();
            this.exercise = new System.Windows.Forms.TextBox();
            this.exerciseLabel = new System.Windows.Forms.Label();
            this.typeLabel = new System.Windows.Forms.Label();
            this.Musclesworked = new System.Windows.Forms.ListBox();
            this.musclegroups = new System.Windows.Forms.ComboBox();
            this.role = new System.Windows.Forms.ComboBox();
            this.roleLabel = new System.Windows.Forms.Label();
            this.musclesworkedLabel = new System.Windows.Forms.Label();
            this.addmuscleworkedButton = new System.Windows.Forms.Button();
            this.type = new System.Windows.Forms.ComboBox();
            this.deletemuscleworkedButton = new System.Windows.Forms.Button();
            this.Menu.SuspendLayout();
            this.SuspendLayout();
            // 
            // Menu
            // 
            this.Menu.BackColor = System.Drawing.SystemColors.HotTrack;
            this.Menu.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.fileToolStripMenuItem,
            this.exitToolStripMenuItem});
            this.Menu.Location = new System.Drawing.Point(0, 0);
            this.Menu.Name = "Menu";
            this.Menu.Size = new System.Drawing.Size(584, 24);
            this.Menu.TabIndex = 0;
            this.Menu.Text = "Menu";
            // 
            // fileToolStripMenuItem
            // 
            this.fileToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.usersToolStripMenuItem,
            this.mescleGroupsToolStripMenuItem});
            this.fileToolStripMenuItem.Name = "fileToolStripMenuItem";
            this.fileToolStripMenuItem.Size = new System.Drawing.Size(48, 20);
            this.fileToolStripMenuItem.Text = "Open";
            // 
            // usersToolStripMenuItem
            // 
            this.usersToolStripMenuItem.Name = "usersToolStripMenuItem";
            this.usersToolStripMenuItem.Size = new System.Drawing.Size(151, 22);
            this.usersToolStripMenuItem.Text = "Users";
            this.usersToolStripMenuItem.Click += new System.EventHandler(this.usersToolStripMenuItem_Click);
            // 
            // mescleGroupsToolStripMenuItem
            // 
            this.mescleGroupsToolStripMenuItem.Name = "mescleGroupsToolStripMenuItem";
            this.mescleGroupsToolStripMenuItem.Size = new System.Drawing.Size(151, 22);
            this.mescleGroupsToolStripMenuItem.Text = "Mescle groups";
            this.mescleGroupsToolStripMenuItem.Click += new System.EventHandler(this.mescleGroupsToolStripMenuItem_Click);
            // 
            // exitToolStripMenuItem
            // 
            this.exitToolStripMenuItem.Name = "exitToolStripMenuItem";
            this.exitToolStripMenuItem.Size = new System.Drawing.Size(38, 20);
            this.exitToolStripMenuItem.Text = "Exit";
            this.exitToolStripMenuItem.Click += new System.EventHandler(this.exitToolStripMenuItem_Click);
            // 
            // Rows
            // 
            this.Rows.FormattingEnabled = true;
            this.Rows.Location = new System.Drawing.Point(299, 27);
            this.Rows.Name = "Rows";
            this.Rows.Size = new System.Drawing.Size(273, 420);
            this.Rows.TabIndex = 1;
            this.Rows.SelectedIndexChanged += new System.EventHandler(this.Rows_SelectedIndexChanged);
            // 
            // search
            // 
            this.search.Location = new System.Drawing.Point(12, 27);
            this.search.Name = "search";
            this.search.Size = new System.Drawing.Size(200, 20);
            this.search.TabIndex = 2;
            // 
            // searchButton
            // 
            this.searchButton.Location = new System.Drawing.Point(218, 25);
            this.searchButton.Name = "searchButton";
            this.searchButton.Size = new System.Drawing.Size(75, 23);
            this.searchButton.TabIndex = 3;
            this.searchButton.Text = "Search";
            this.searchButton.UseVisualStyleBackColor = true;
            this.searchButton.Click += new System.EventHandler(this.searchButton_Click);
            // 
            // deleteButton
            // 
            this.deleteButton.Location = new System.Drawing.Point(218, 401);
            this.deleteButton.Name = "deleteButton";
            this.deleteButton.Size = new System.Drawing.Size(75, 23);
            this.deleteButton.TabIndex = 4;
            this.deleteButton.Text = "Delete";
            this.deleteButton.UseVisualStyleBackColor = true;
            this.deleteButton.Click += new System.EventHandler(this.deleteButton_Click);
            // 
            // saveButton
            // 
            this.saveButton.Location = new System.Drawing.Point(218, 372);
            this.saveButton.Name = "saveButton";
            this.saveButton.Size = new System.Drawing.Size(75, 23);
            this.saveButton.TabIndex = 24;
            this.saveButton.Text = "Save";
            this.saveButton.UseVisualStyleBackColor = true;
            this.saveButton.Click += new System.EventHandler(this.saveButton_Click);
            // 
            // addButton
            // 
            this.addButton.Location = new System.Drawing.Point(12, 372);
            this.addButton.Name = "addButton";
            this.addButton.Size = new System.Drawing.Size(75, 23);
            this.addButton.TabIndex = 23;
            this.addButton.Text = "Add";
            this.addButton.UseVisualStyleBackColor = true;
            this.addButton.Click += new System.EventHandler(this.addButton_Click);
            // 
            // musclegroupsLabel
            // 
            this.musclegroupsLabel.AutoSize = true;
            this.musclegroupsLabel.Location = new System.Drawing.Point(217, 214);
            this.musclegroupsLabel.Name = "musclegroupsLabel";
            this.musclegroupsLabel.Size = new System.Drawing.Size(76, 13);
            this.musclegroupsLabel.TabIndex = 22;
            this.musclegroupsLabel.Text = "Muscle groups";
            // 
            // exercise
            // 
            this.exercise.Location = new System.Drawing.Point(12, 343);
            this.exercise.Name = "exercise";
            this.exercise.Size = new System.Drawing.Size(200, 20);
            this.exercise.TabIndex = 25;
            // 
            // exerciseLabel
            // 
            this.exerciseLabel.AutoSize = true;
            this.exerciseLabel.Location = new System.Drawing.Point(239, 346);
            this.exerciseLabel.Name = "exerciseLabel";
            this.exerciseLabel.Size = new System.Drawing.Size(47, 13);
            this.exerciseLabel.TabIndex = 26;
            this.exerciseLabel.Text = "Exercise";
            // 
            // typeLabel
            // 
            this.typeLabel.AutoSize = true;
            this.typeLabel.Location = new System.Drawing.Point(239, 320);
            this.typeLabel.Name = "typeLabel";
            this.typeLabel.Size = new System.Drawing.Size(31, 13);
            this.typeLabel.TabIndex = 28;
            this.typeLabel.Text = "Type";
            // 
            // Musclesworked
            // 
            this.Musclesworked.FormattingEnabled = true;
            this.Musclesworked.Location = new System.Drawing.Point(12, 84);
            this.Musclesworked.Name = "Musclesworked";
            this.Musclesworked.Size = new System.Drawing.Size(200, 121);
            this.Musclesworked.TabIndex = 29;
            // 
            // musclegroups
            // 
            this.musclegroups.FormattingEnabled = true;
            this.musclegroups.Location = new System.Drawing.Point(12, 211);
            this.musclegroups.Name = "musclegroups";
            this.musclegroups.Size = new System.Drawing.Size(200, 21);
            this.musclegroups.TabIndex = 30;
            // 
            // role
            // 
            this.role.FormattingEnabled = true;
            this.role.Location = new System.Drawing.Point(12, 238);
            this.role.Name = "role";
            this.role.Size = new System.Drawing.Size(200, 21);
            this.role.TabIndex = 31;
            // 
            // roleLabel
            // 
            this.roleLabel.AutoSize = true;
            this.roleLabel.Location = new System.Drawing.Point(239, 241);
            this.roleLabel.Name = "roleLabel";
            this.roleLabel.Size = new System.Drawing.Size(29, 13);
            this.roleLabel.TabIndex = 32;
            this.roleLabel.Text = "Role";
            // 
            // musclesworkedLabel
            // 
            this.musclesworkedLabel.AutoSize = true;
            this.musclesworkedLabel.Location = new System.Drawing.Point(215, 84);
            this.musclesworkedLabel.Name = "musclesworkedLabel";
            this.musclesworkedLabel.Size = new System.Drawing.Size(84, 13);
            this.musclesworkedLabel.TabIndex = 33;
            this.musclesworkedLabel.Text = "Muscles worked";
            // 
            // addmuscleworkedButton
            // 
            this.addmuscleworkedButton.Location = new System.Drawing.Point(12, 265);
            this.addmuscleworkedButton.Name = "addmuscleworkedButton";
            this.addmuscleworkedButton.Size = new System.Drawing.Size(200, 23);
            this.addmuscleworkedButton.TabIndex = 34;
            this.addmuscleworkedButton.Text = "Add muscle worked";
            this.addmuscleworkedButton.UseVisualStyleBackColor = true;
            this.addmuscleworkedButton.Click += new System.EventHandler(this.addmuscleworkedButton_Click);
            // 
            // type
            // 
            this.type.FormattingEnabled = true;
            this.type.Location = new System.Drawing.Point(12, 312);
            this.type.Name = "type";
            this.type.Size = new System.Drawing.Size(200, 21);
            this.type.TabIndex = 35;
            // 
            // deletemuscleworkedButton
            // 
            this.deletemuscleworkedButton.Location = new System.Drawing.Point(218, 265);
            this.deletemuscleworkedButton.Name = "deletemuscleworkedButton";
            this.deletemuscleworkedButton.Size = new System.Drawing.Size(75, 23);
            this.deletemuscleworkedButton.TabIndex = 36;
            this.deletemuscleworkedButton.Text = "Delete";
            this.deletemuscleworkedButton.UseVisualStyleBackColor = true;
            this.deletemuscleworkedButton.Click += new System.EventHandler(this.deletemuscleworkedButton_Click);
            // 
            // Exercises
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(584, 461);
            this.Controls.Add(this.deletemuscleworkedButton);
            this.Controls.Add(this.type);
            this.Controls.Add(this.addmuscleworkedButton);
            this.Controls.Add(this.musclesworkedLabel);
            this.Controls.Add(this.roleLabel);
            this.Controls.Add(this.role);
            this.Controls.Add(this.musclegroups);
            this.Controls.Add(this.Musclesworked);
            this.Controls.Add(this.typeLabel);
            this.Controls.Add(this.exerciseLabel);
            this.Controls.Add(this.exercise);
            this.Controls.Add(this.saveButton);
            this.Controls.Add(this.addButton);
            this.Controls.Add(this.musclegroupsLabel);
            this.Controls.Add(this.deleteButton);
            this.Controls.Add(this.searchButton);
            this.Controls.Add(this.search);
            this.Controls.Add(this.Rows);
            this.Controls.Add(this.Menu);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedToolWindow;
            this.MainMenuStrip = this.Menu;
            this.Name = "Exercises";
            this.Text = "Exercises";
            this.Menu.ResumeLayout(false);
            this.Menu.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.MenuStrip Menu;
        private System.Windows.Forms.ToolStripMenuItem fileToolStripMenuItem;
        private System.Windows.Forms.ListBox Rows;
        private System.Windows.Forms.TextBox search;
        private System.Windows.Forms.Button searchButton;
        private System.Windows.Forms.Button deleteButton;
        private System.Windows.Forms.ToolStripMenuItem exitToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem usersToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem mescleGroupsToolStripMenuItem;
        private System.Windows.Forms.Button saveButton;
        private System.Windows.Forms.Button addButton;
        private System.Windows.Forms.Label musclegroupsLabel;
        private System.Windows.Forms.TextBox exercise;
        private System.Windows.Forms.Label exerciseLabel;
        private System.Windows.Forms.Label typeLabel;
        private System.Windows.Forms.ListBox Musclesworked;
        private System.Windows.Forms.ComboBox musclegroups;
        private System.Windows.Forms.ComboBox role;
        private System.Windows.Forms.Label roleLabel;
        private System.Windows.Forms.Label musclesworkedLabel;
        private System.Windows.Forms.Button addmuscleworkedButton;
        private System.Windows.Forms.ComboBox type;
        private System.Windows.Forms.Button deletemuscleworkedButton;
    }
}

