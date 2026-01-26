namespace admin
{
    partial class Authorization
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
            this.AdminToken = new System.Windows.Forms.TextBox();
            this.validateButton = new System.Windows.Forms.Button();
            this.validateapiadmintokenLabel = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // AdminToken
            // 
            this.AdminToken.Location = new System.Drawing.Point(228, 205);
            this.AdminToken.Name = "AdminToken";
            this.AdminToken.Size = new System.Drawing.Size(234, 20);
            this.AdminToken.TabIndex = 0;
            // 
            // validateButton
            // 
            this.validateButton.Location = new System.Drawing.Point(468, 202);
            this.validateButton.Name = "validateButton";
            this.validateButton.Size = new System.Drawing.Size(75, 23);
            this.validateButton.TabIndex = 1;
            this.validateButton.Text = "Validate";
            this.validateButton.UseVisualStyleBackColor = true;
            this.validateButton.Click += new System.EventHandler(this.validateButton_Click);
            // 
            // validateapiadmintokenLabel
            // 
            this.validateapiadmintokenLabel.AutoSize = true;
            this.validateapiadmintokenLabel.Location = new System.Drawing.Point(336, 159);
            this.validateapiadmintokenLabel.Name = "validateapiadmintokenLabel";
            this.validateapiadmintokenLabel.Size = new System.Drawing.Size(126, 13);
            this.validateapiadmintokenLabel.TabIndex = 2;
            this.validateapiadmintokenLabel.Text = "Validate API admin token";
            // 
            // Authorization
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.validateapiadmintokenLabel);
            this.Controls.Add(this.validateButton);
            this.Controls.Add(this.AdminToken);
            this.Name = "Authorization";
            this.Text = "Authorization";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox AdminToken;
        private System.Windows.Forms.Button validateButton;
        private System.Windows.Forms.Label validateapiadmintokenLabel;
    }
}