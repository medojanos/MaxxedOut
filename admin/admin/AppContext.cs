using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace admin
{
    public class AppContext : ApplicationContext
    {
        private int formCount;

        private void onFormClosed(object sender, EventArgs e)
        {
            formCount--;

            if (formCount == 0)
            {
                ExitThread();
            }
        }

        public AppContext()
        {
            loginSucceeded();
        }

        private void loginSucceeded()
        {
            var forms = new List<Form>()
            {
                new Muscle_groups(),
                new Exercises(),
                new Users()
            };

            foreach (var form in forms)
            {
                registerForm(form);
            }
        }

        private void registerForm(Form form)
        {
            form.FormClosed += onFormClosed;
            form.Show();
            formCount++;
        }
    }
}
