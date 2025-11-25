using System;
using System.Windows.Forms;
using System.Collections.Generic;

namespace admin.Utils
{
    public class FormManager : ApplicationContext
    {
        private int openForms = 0;

        private void OnFormClosed(object sender, FormClosedEventArgs e)
        {
            openForms--;

            if (openForms == 0)
            {
                ExitThread();
            }
        }

        public FormManager()
        {
            var forms = new List<Form>
            {
                new Exercises(),
                new Muscle_groups(),
                new Users()
            };

            openForms = forms.Count;    

            foreach (var form in forms)
            {
                form.FormClosed += OnFormClosed;
                form.Show();
            }
        }
    }
}
