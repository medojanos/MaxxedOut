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
            this.savemuscleworkedButton = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // Rows
            // 
            this.Rows.FormattingEnabled = true;
            this.Rows.ItemHeight = 16;
            this.Rows.Location = new System.Drawing.Point(396, 13);
            this.Rows.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.Rows.Name = "Rows";
            this.Rows.Size = new System.Drawing.Size(363, 516);
            this.Rows.TabIndex = 1;
            this.Rows.SelectedIndexChanged += new System.EventHandler(this.Rows_SelectedIndexChanged);
            // 
            // search
            // 
            this.search.Location = new System.Drawing.Point(13, 13);
            this.search.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.search.Name = "search";
            this.search.Size = new System.Drawing.Size(265, 22);
            this.search.TabIndex = 2;
            // 
            // searchButton
            // 
            this.searchButton.Location = new System.Drawing.Point(288, 11);
            this.searchButton.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.searchButton.Name = "searchButton";
            this.searchButton.Size = new System.Drawing.Size(100, 28);
            this.searchButton.TabIndex = 3;
            this.searchButton.Text = "Search";
            this.searchButton.UseVisualStyleBackColor = true;
            this.searchButton.Click += new System.EventHandler(this.searchButton_Click);
            // 
            // deleteButton
            // 
            this.deleteButton.Location = new System.Drawing.Point(288, 474);
            this.deleteButton.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.deleteButton.Name = "deleteButton";
            this.deleteButton.Size = new System.Drawing.Size(100, 28);
            this.deleteButton.TabIndex = 4;
            this.deleteButton.Text = "Delete";
            this.deleteButton.UseVisualStyleBackColor = true;
            this.deleteButton.Click += new System.EventHandler(this.deleteButton_Click);
            // 
            // saveButton
            // 
            this.saveButton.Location = new System.Drawing.Point(288, 438);
            this.saveButton.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.saveButton.Name = "saveButton";
            this.saveButton.Size = new System.Drawing.Size(100, 28);
            this.saveButton.TabIndex = 24;
            this.saveButton.Text = "Save";
            this.saveButton.UseVisualStyleBackColor = true;
            this.saveButton.Click += new System.EventHandler(this.saveButton_Click);
            // 
            // addButton
            // 
            this.addButton.Location = new System.Drawing.Point(13, 438);
            this.addButton.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.addButton.Name = "addButton";
            this.addButton.Size = new System.Drawing.Size(100, 28);
            this.addButton.TabIndex = 23;
            this.addButton.Text = "Add";
            this.addButton.UseVisualStyleBackColor = true;
            this.addButton.Click += new System.EventHandler(this.addButton_Click);
            // 
            // musclegroupsLabel
            // 
            this.musclegroupsLabel.AutoSize = true;
            this.musclegroupsLabel.Location = new System.Drawing.Point(286, 221);
            this.musclegroupsLabel.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.musclegroupsLabel.Name = "musclegroupsLabel";
            this.musclegroupsLabel.Size = new System.Drawing.Size(95, 16);
            this.musclegroupsLabel.TabIndex = 22;
            this.musclegroupsLabel.Text = "Muscle groups";
            // 
            // exercise
            // 
            this.exercise.Location = new System.Drawing.Point(13, 402);
            this.exercise.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.exercise.Name = "exercise";
            this.exercise.Size = new System.Drawing.Size(265, 22);
            this.exercise.TabIndex = 25;
            // 
            // exerciseLabel
            // 
            this.exerciseLabel.AutoSize = true;
            this.exerciseLabel.Location = new System.Drawing.Point(316, 406);
            this.exerciseLabel.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.exerciseLabel.Name = "exerciseLabel";
            this.exerciseLabel.Size = new System.Drawing.Size(59, 16);
            this.exerciseLabel.TabIndex = 26;
            this.exerciseLabel.Text = "Exercise";
            // 
            // typeLabel
            // 
            this.typeLabel.AutoSize = true;
            this.typeLabel.Location = new System.Drawing.Point(316, 374);
            this.typeLabel.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.typeLabel.Name = "typeLabel";
            this.typeLabel.Size = new System.Drawing.Size(39, 16);
            this.typeLabel.TabIndex = 28;
            this.typeLabel.Text = "Type";
            // 
            // Musclesworked
            // 
            this.Musclesworked.FormattingEnabled = true;
            this.Musclesworked.ItemHeight = 16;
            this.Musclesworked.Location = new System.Drawing.Point(13, 61);
            this.Musclesworked.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.Musclesworked.Name = "Musclesworked";
            this.Musclesworked.Size = new System.Drawing.Size(265, 148);
            this.Musclesworked.TabIndex = 29;
            this.Musclesworked.SelectedIndexChanged += new System.EventHandler(this.Musclesworked_SelectedIndexChanged);
            // 
            // musclegroups
            // 
            this.musclegroups.FormattingEnabled = true;
            this.musclegroups.Location = new System.Drawing.Point(13, 218);
            this.musclegroups.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.musclegroups.Name = "musclegroups";
            this.musclegroups.Size = new System.Drawing.Size(265, 24);
            this.musclegroups.TabIndex = 30;
            // 
            // role
            // 
            this.role.FormattingEnabled = true;
            this.role.Location = new System.Drawing.Point(13, 251);
            this.role.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.role.Name = "role";
            this.role.Size = new System.Drawing.Size(265, 24);
            this.role.TabIndex = 31;
            // 
            // roleLabel
            // 
            this.roleLabel.AutoSize = true;
            this.roleLabel.Location = new System.Drawing.Point(316, 254);
            this.roleLabel.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.roleLabel.Name = "roleLabel";
            this.roleLabel.Size = new System.Drawing.Size(36, 16);
            this.roleLabel.TabIndex = 32;
            this.roleLabel.Text = "Role";
            // 
            // musclesworkedLabel
            // 
            this.musclesworkedLabel.AutoSize = true;
            this.musclesworkedLabel.Location = new System.Drawing.Point(284, 61);
            this.musclesworkedLabel.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.musclesworkedLabel.Name = "musclesworkedLabel";
            this.musclesworkedLabel.Size = new System.Drawing.Size(104, 16);
            this.musclesworkedLabel.TabIndex = 33;
            this.musclesworkedLabel.Text = "Muscles worked";
            // 
            // addmuscleworkedButton
            // 
            this.addmuscleworkedButton.Location = new System.Drawing.Point(13, 284);
            this.addmuscleworkedButton.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.addmuscleworkedButton.Name = "addmuscleworkedButton";
            this.addmuscleworkedButton.Size = new System.Drawing.Size(267, 28);
            this.addmuscleworkedButton.TabIndex = 34;
            this.addmuscleworkedButton.Text = "Add muscle worked";
            this.addmuscleworkedButton.UseVisualStyleBackColor = true;
            this.addmuscleworkedButton.Click += new System.EventHandler(this.addmuscleworkedButton_Click);
            // 
            // type
            // 
            this.type.FormattingEnabled = true;
            this.type.Location = new System.Drawing.Point(13, 364);
            this.type.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.type.Name = "type";
            this.type.Size = new System.Drawing.Size(265, 24);
            this.type.TabIndex = 35;
            // 
            // deletemuscleworkedButton
            // 
            this.deletemuscleworkedButton.Location = new System.Drawing.Point(288, 320);
            this.deletemuscleworkedButton.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.deletemuscleworkedButton.Name = "deletemuscleworkedButton";
            this.deletemuscleworkedButton.Size = new System.Drawing.Size(100, 28);
            this.deletemuscleworkedButton.TabIndex = 36;
            this.deletemuscleworkedButton.Text = "Delete";
            this.deletemuscleworkedButton.UseVisualStyleBackColor = true;
            this.deletemuscleworkedButton.Click += new System.EventHandler(this.deletemuscleworkedButton_Click);
            // 
            // savemuscleworkedButton
            // 
            this.savemuscleworkedButton.Location = new System.Drawing.Point(288, 284);
            this.savemuscleworkedButton.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.savemuscleworkedButton.Name = "savemuscleworkedButton";
            this.savemuscleworkedButton.Size = new System.Drawing.Size(100, 28);
            this.savemuscleworkedButton.TabIndex = 37;
            this.savemuscleworkedButton.Text = "Save";
            this.savemuscleworkedButton.UseVisualStyleBackColor = true;
            this.savemuscleworkedButton.Click += new System.EventHandler(this.savemuscleworkedButton_Click);
            // 
            // Exercises
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(779, 567);
            this.Controls.Add(this.savemuscleworkedButton);
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
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedToolWindow;
            this.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.Name = "Exercises";
            this.Text = "a";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.ListBox Rows;
        private System.Windows.Forms.TextBox search;
        private System.Windows.Forms.Button searchButton;
        private System.Windows.Forms.Button deleteButton;
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
        private System.Windows.Forms.Button savemuscleworkedButton;
    }
}

