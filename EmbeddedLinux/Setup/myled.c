#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/gpio.h>
#include <linux/fs.h>
#include <linux/kobject.h>

#define MYLED_GPIO 28   /* P9_12 on your BBB = gpio-28 */

/* sysfs kobject */
static struct kobject *myled_kobj;

/* sysfs store() callback: user writes 0/1 */
static ssize_t value_store(struct kobject *kobj,
                           struct kobj_attribute *attr,
                           const char *buf, size_t count)
{
    int state;

    if (kstrtoint(buf, 10, &state) == 0) {
        gpio_set_value(MYLED_GPIO, state ? 1 : 0);
    }

    return count;
}

static struct kobj_attribute value_attribute =
    __ATTR(value, 0220, NULL, value_store);

static int __init myled_init(void)
{
    int ret;

    pr_info("myled: init\n");

    /* Request GPIO */
    ret = gpio_request(MYLED_GPIO, "myled_gpio");
    if (ret) {
        pr_err("myled: gpio_request failed\n");
        return ret;
    }

    /* Set direction */
    ret = gpio_direction_output(MYLED_GPIO, 0);
    if (ret) {
        pr_err("myled: gpio_direction_output failed\n");
        gpio_free(MYLED_GPIO);
        return ret;
    }

    /* Create /sys/kernel/myled/ */
    myled_kobj = kobject_create_and_add("myled", kernel_kobj);
    if (!myled_kobj) {
        pr_err("myled: kobject_create failed\n");
        gpio_free(MYLED_GPIO);
        return -ENOMEM;
    }

    /* Create /sys/kernel/myled/value */
    ret = sysfs_create_file(myled_kobj, &value_attribute.attr);
    if (ret) {
        pr_err("myled: sysfs_create_file failed\n");
        kobject_put(myled_kobj);
        gpio_free(MYLED_GPIO);
        return ret;
    }

    pr_info("myled: loaded OK\n");
    return 0;
}

static void __exit myled_exit(void)
{
    sysfs_remove_file(myled_kobj, &value_attribute.attr);
    kobject_put(myled_kobj);

    gpio_set_value(MYLED_GPIO, 0);
    gpio_free(MYLED_GPIO);

    pr_info("myled: unloaded\n");
}

module_init(myled_init);
module_exit(myled_exit);

MODULE_LICENSE("GPL");
MODULE_AUTHOR("APEX");
MODULE_DESCRIPTION("GPIO-only LED driver for BBB using GPIO 28 (P9_12)");
