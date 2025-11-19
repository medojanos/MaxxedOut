namespace admin
{
    partial class Muscle_groups
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
            this.exercisesToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.exitToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.deleteButton = new System.Windows.Forms.Button();
            this.searchButton = new System.Windows.Forms.Button();
            this.search = new System.Windows.Forms.TextBox();
            this.Rows = new System.Windows.Forms.ListBox();
            this.name = new System.Windows.Forms.TextBox();
            this.musclegroupLabel = new System.Windows.Forms.Label();
            this.saveButton = new System.Windows.Forms.Button();
            this.addButton = new System.Windows.Forms.Button();
            this.Menu.SuspendLayout();
            this.SuspendLayout();
            // 
            // Menu
            // 
            this.Menu.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(255)))), ((int)(((byte)(128)))));
            this.Menu.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.fileToolStripMenuItem,
            this.exitToolStripMenuItem});
            this.Menu.Location = new System.Drawing.Point(0, 0);
            this.Menu.Name = "Menu";
            this.Menu.Size = new System.Drawing.Size(584, 24);
            this.Menu.TabIndex = 1;
            this.Menu.Text = "Menu";
            // 
            // fileToolStripMenuItem
            // 
            this.fileToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.usersToolStripMenuItem,
            this.exercisesToolStripMenuItem});
            this.fileToolStripMenuItem.Name = "fileToolStripMenuItem";
            this.fileToolStripMenuItem.Size = new System.Drawing.Size(48, 20);
            this.fileToolStripMenuItem.Text = "Open";
            // 
            // usersToolStripMenuItem
            // 
            this.usersToolStripMenuItem.Name = "usersToolStripMenuItem";
            this.usersToolStripMenuItem.Size = new System.Drawing.Size(121, 22);
            this.usersToolStripMenuItem.Text = "Users";
            this.usersToolStripMenuItem.Click += new System.EventHandler(this.usersToolStripMenuItem_Click);
            // 
            // exercisesToolStripMenuItem
            // 
            this.exercisesToolStripMenuItem.Name = "exercisesToolStripMenuItem";
            this.exercisesToolStripMenuItem.Size = new System.Drawing.Size(121, 22);
            this.exercisesToolStripMenuItem.Text = "Exercises";
            this.exercisesToolStripMenuItem.Click += new System.EventHandler(this.exercisesToolStripMenuItem_Click);
            // 
            // exitToolStripMenuItem
            // 
            this.exitToolStripMenuItem.Name = "exitToolStripMenuItem";
            this.exitToolStripMenuItem.Size = new System.Drawing.Size(38, 20);
            this.exitToolStripMenuItem.Text = "Exit";
            this.exitToolStripMenuItem.Click += new System.EventHandler(this.exitToolStripMenuItem_Click);
            // 
            // deleteButton
            // 
            this.deleteButton.Location = new System.Drawing.Point(218, 285);
            this.deleteButton.Name = "deleteButton";
            this.deleteButton.Size = new System.Drawing.Size(75, 23);
            this.deleteButton.TabIndex = 9;
            this.deleteButton.Text = "Delete";
            this.deleteButton.UseVisualStyleBackColor = true;
            this.deleteButton.Click += new System.EventHandler(this.deleteButton_Click);
            // 
            // searchButton
            // 
            this.searchButton.Location = new System.Drawing.Point(218, 25);
            this.searchButton.Name = "searchButton";
            this.searchButton.Size = new System.Drawing.Size(75, 23);
            this.searchButton.TabIndex = 8;
            this.searchButton.Text = "Search";
            this.searchButton.UseVisualStyleBackColor = true;
            this.searchButton.Click += new System.EventHandler(this.searchButton_Click);
            // 
            // search
            // 
            this.search.Location = new System.Drawing.Point(12, 27);
            this.search.Name = "search";
            this.search.Size = new System.Drawing.Size(200, 20);
            this.search.TabIndex = 7;
            // 
            // Rows
            // 
            this.Rows.FormattingEnabled = true;
            this.Rows.Location = new System.Drawing.Point(299, 27);
            this.Rows.Name = "Rows";
            this.Rows.Size = new System.Drawing.Size(273, 420);
            this.Rows.TabIndex = 6;
            this.Rows.SelectedIndexChanged += new System.EventHandler(this.Rows_SelectedIndexChanged);
            // 
            // name
            // 
            this.name.Location = new System.Drawing.Point(12, 221);
            this.name.Name = "name";
            this.name.Size = new System.Drawing.Size(200, 20);
            this.name.TabIndex = 11;
            // 
            // musclegroupLabel
            // 
            this.musclegroupLabel.AutoSize = true;
            this.musclegroupLabel.Location = new System.Drawing.Point(222, 224);
            this.musclegroupLabel.Name = "musclegroupLabel";
            this.musclegroupLabel.Size = new System.Drawing.Size(71, 13);
            this.musclegroupLabel.TabIndex = 18;
            this.musclegroupLabel.Text = "Muscle group";
            // 
            // saveButton
            // 
            this.saveButton.Location = new System.Drawing.Point(218, 247);
            this.saveButton.Name = "saveButton";
            this.saveButton.Size = new System.Drawing.Size(75, 23);
            this.saveButton.TabIndex = 20;
            this.saveButton.Text = "Save";
            this.saveButton.UseVisualStyleBackColor = true;
            this.saveButton.Click += new System.EventHandler(this.saveButton_Click);
            // 
            // addButton
            // 
            this.addButton.Location = new System.Drawing.Point(12, 247);
            this.addButton.Name = "addButton";
            this.addButton.Size = new System.Drawing.Size(75, 23);
            this.addButton.TabIndex = 19;
            this.addButton.Text = "Add";
            this.addButton.UseVisualStyleBackColor = true;
            this.addButton.Click += new System.EventHandler(this.addButton_Click);
            // 
            // Muscle_groups
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(584, 461);
            this.Controls.Add(this.saveButton);
            this.Controls.Add(this.addButton);
            this.Controls.Add(this.musclegroupLabel);
            this.Controls.Add(this.name);
            this.Controls.Add(this.deleteButton);
            this.Controls.Add(this.searchButton);
            this.Controls.Add(this.search);
            this.Controls.Add(this.Rows);
            this.Controls.Add(this.Menu);
            this.Name = "Muscle_groups";
            this.Text = "Muscle_groups";
            this.Menu.ResumeLayout(false);
            this.Menu.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.MenuStrip Menu;
        private System.Windows.Forms.ToolStripMenuItem fileToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem usersToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem exercisesToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem exitToolStripMenuItem;
        private System.Windows.Forms.Button deleteButton;
        private System.Windows.Forms.Button searchButton;
        private System.Windows.Forms.TextBox search;
        private System.Windows.Forms.ListBox Rows;
        private System.Windows.Forms.TextBox name;
        private System.Windows.Forms.Label musclegroupLabel;
        private System.Windows.Forms.Button saveButton;
        private System.Windows.Forms.Button addButton;
    }
}