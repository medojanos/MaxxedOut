using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace admin
{
    public class AppContext : ApplicationContext
    {
        private void onFormClosed(object sender, EventArgs e)
        {
            if (Application.OpenForms.Count == 0)
            {
                ExitThread();
            }
        }

        public AppContext()
        {
            var forms = new List<Form>()
            {
                new Exercises(),
                new Users(),
                new Muscle_groups()
            };

            foreach (var form in forms)
            {
                form.FormClosed += onFormClosed;
            }

            foreach (var form in forms)
            {
                form.Show();
            }
        }
    }
}
