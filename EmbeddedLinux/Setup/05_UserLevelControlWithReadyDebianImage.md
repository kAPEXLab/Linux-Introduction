# User Level BBB GPIO-LED Control on Debian Image

Login: `ssh debian@192.168.7.2`
If error: `ssh-keygen -f "/home/apexlab/.ssh/known_hosts" -R "192.168.7.2"`

UserID: debian
Default Pass: temppwd

Aftersuccessful login:

1. Check `uname -a`

	You should see:

  		6.18.x
  		armv7l
  		something like am33x


2. Confirm OS identity: `cat /etc/os-release`

	You should see:

   Debian 13 (Trixie)
   Possibly "IoT" variant

3. `cat /proc/device-tree/model`

Expected: TI AM335x BeagleBone Black

4. View top-level filesystem: `ls -l /`

5. Verify root filesystem is SD card:  `mount | grep " / "`

You should see something like: `/dev/mmcblk0p3 on / type ext4`

6. Check kernel modules location: `ls /lib/modules`

You should see: `6.18.16-bone23`

7. Check device tree location: `ls /boot`

````
	Look for:
		.dtb files (Device Tree Blobs)
	These define: Pins, Peripherals, Board configuration, Critical for GPIO later.
````
---------------------------------------
What problem are we solving?

Your kernel is generic.
But your board has:
* specific pins
* LEDs
* GPIO controllers
* peripherals

👉 So how does the kernel know all this?
Answer: 👉 Device Tree

**Device Tree** = A data structure that tells the kernel:
* what hardware exists
* where it is mapped
* how to use it
* It is not code
* It is hardware description

This shows the live device tree loaded by the kernel. `ls /proc/device-tree/`

Device Tree Blob used for your BeagleBone Black `ls /boot/dtbs/* | grep boneblack`
Expected: am335x-boneblack.dtb

---------------------------------------
LEDs appear in `/sys/class/leds` because:

The Device Tree describes the LEDs → the kernel reads it during boot → the LED driver is loaded → and it exposes those LEDs in /sys/class/leds

Break it into cause → effect
* Device Tree says: “These GPIO pins are LEDs”
* Kernel:
  * reads Device Tree
  * loads LED driver
* Driver:
  * registers LEDs with the kernel
* Kernel exposes them in: `/sys/class/leds/`

This is the core Embedded Linux model:
	Hardware is described, not hardcoded. Which means:
		* Change Device Tree → hardware behavior changes
		* No need to recompile applications

---------------------------------------

Inspect one LED
	  
    cd /sys/class/leds/beaglebone:green:usr0
	  ls
	
Expected: 
  brightness
  trigger
  others

Turn LED ON manually

    echo none > trigger
	  echo 1 > brightness

Turn LED OFF

    echo 0 > brightness

Try automatic behavior
    echo heartbeat > trigger

---------------------------------------

Modern Linux GPIO model

Modern Linux GPIO model

	/sys/class/gpio is deprecated
	gpiod is stable, cleaner, future-proof


Check if GPIO system exists
	
  `ls /dev/gpiochip*`
	Expected: /dev/gpiochip0 /dev/gpiochip1 ...

Detect GPIO chips: `gpiodetect`

    gpiochip0 [gpio-0-31] (32 lines)
    gpiochip1 [gpio-32-63] (32 lines)
    gpiochip2 [gpio-64-95] (32 lines)
    gpiochip3 [gpio-96-127] (32 lines)

List GPIO lines `gpioinfo`

The Flow:

    User (gpiod)
       ↓
    libgpiod
       ↓
    Kernel GPIO driver
       ↓
    Device Tree mapping
       ↓
    Physical pin on AM335x

---------------------------------------
Identify one unused GPIO line number: gpioinfo

    ON: P9_12 gpioset -c gpiochip0 28=1
    OFF: P9_12 gpioset -c gpiochip0 28=0

Why does Linux require a GPIO line to be “free” before you can control it? 👉 A GPIO line can only have one owner at a time in the kernel.

------------------------------------
If Device Tree already configures pins at boot, why does Linux still expose GPIO lines dynamically via gpiod?  👉 Device Tree defines hardware setup, but gpiod provides a runtime API for safe, controlled access to GPIO lines. 👉 It is a controlled interface between userspace and kernel GPIO subsystem

👉 Why must every GPIO pin in Linux be explicitly mapped and controlled through a kernel subsystem instead of allowing direct hardware register access from userspace? 👉 Only the kernel is allowed to access hardware registers directly, so it can enforce safety, coordination, and correct sharing between multiple userspace programs and drivers.
------------------------------------

For C Code

    sudo apt update
    sudo apt install build-essential libgpiod-dev

`nano gpio_toggle.c`

Sample Code

````c
#include <gpiod.h>
#include <stdio.h>
#include <unistd.h>

int main() {
    struct gpiod_chip *chip;
    struct gpiod_line_settings *settings;
    struct gpiod_line_request *request;
    struct gpiod_request_config *req_cfg;
    struct gpiod_line_config *line_cfg;

    unsigned int line = 28;

    chip = gpiod_chip_open("/dev/gpiochip0");
    if (!chip) {
  perror("chip open");
  return 1;
    }

    settings = gpiod_line_settings_new();
    gpiod_line_settings_set_direction(settings, GPIOD_LINE_DIRECTION_OUTPUT);

    line_cfg = gpiod_line_config_new();
    gpiod_line_config_add_line_settings(line_cfg, &line, 1, settings);

    req_cfg = gpiod_request_config_new();
    gpiod_request_config_set_consumer(req_cfg, "gpio-c");

    request = gpiod_chip_request_lines(chip, req_cfg, line_cfg);
    if (!request) {
  perror("request lines");
  return 1;
    }

    while (1) {
  gpiod_line_request_set_value(request, line, 1);
  sleep(1);
  gpiod_line_request_set_value(request, line, 0);
  sleep(1);
    }

    gpiod_line_request_release(request);
    gpiod_line_config_free(line_cfg);
    gpiod_request_config_free(req_cfg);
    gpiod_line_settings_free(settings);
    gpiod_chip_close(chip);

    return 0;
}
````

compile using: `gcc gpio_toggle.c -o gpio_toggle -lgpiod`

First confirm your working binary, Assuming your compiled program is: `./gpio_toggle`

Move binary to system location: `sudo mv gpio_toggle /usr/local/bin/`

Test: `/usr/local/bin/gpio_toggle`


------------------------------------

Create systemd service file: `sudo nano /etc/systemd/system/gpio-led.service`

````
[Unit]
Description=GPIO LED Toggle Service
After=multi-user.target

[Service]
ExecStart=/usr/local/bin/gpio_toggle
Restart=always
User=root

[Install]
WantedBy=multi-user.target
````
Enable service
````
sudo systemctl daemon-reload
sudo systemctl enable gpio-led.service
````
Start immediately: `sudo systemctl start gpio-led.service`

Check status: `systemctl status gpio-led.service`

What you just built:

    Boot completes
       ↓
    systemd starts service
       ↓
    your C program launches
       ↓
    libgpiod controls GPIO
       ↓
    LED starts blinking automatically

------------------------------------

What that actually means: 👉 You are controlling it through the Linux kernel from userspace
    
    Your program (Python or C)
      ↓
    libgpiod (userspace library)
      ↓
    Linux GPIO subsystem (kernel)
      ↓
    /dev/gpiochipX interface
      ↓
    Device Tree configuration
      ↓
    AM335x hardware GPIO controller
      ↓
    LED on physical pin

-----------------------------------------


How Linux Represents GPIO Internally
	Linux GPIO subsystem uses two important concepts:
	1) GPIO Controller (chip)

	Hardware block (e.g., AM33xx GPIO0, GPIO1...)
	Registers actual pin states
	Exposed as /dev/gpiochipX

	2) GPIO Lines

	Individual pins inside a chip (0–31)
	Not integers anymore
	Each pin has metadata: name, label, consumer, used/free

	Example:
	gpiochip1 may expose 32 pins → lines 0–31.		
		
How Does a LED Kernel Driver Work Internally?

A minimal LED driver has three layers:
1) LED Class Driver

Registers your LED with the kernel
Creates /sys/class/leds/myled/* files
Handles brightness logic

2) GPIO Subsystem

Requests a GPIO
Sets direction (output)
Drives the value HIGH/LOW

3) SoC GPIO Controller

Actual hardware registers toggle the pin
Kernel abstracts this from you

	Flow when user writes a value:
	echo 1 > /sys/class/leds/myled/brightness
	      ↓
	LED class driver
	      ↓
	GPIO subsystem
	      ↓
	AM335x GPIO hardware
	      ↓
	LED turns ON

cat /sys/kernel/debug/gpio


-----------------------------------------------
Minimal LED Kernel Driver Design (Concept Only, No Code Yet)

We will create a minimal Linux kernel module that:

	Registers a new LED device with the kernel.	Creates: `/sys/class/leds/myled/brightness`


	Reads the brightness values (0 or 1).
	Controls GPIO0_28 (which is P9_12) based on brightness.

Components of a Minimal LED Driver


1. A struct led_classdev instance. This tells the LED subsystem:
	*the name of your LED
	* max brightness
	*which function to call when brightness changes

2. A brightness callback function
	* This is where your GPIO is toggled.
3. Module init & exit functions
	* Request the GPIO
	* Configure direction
	* Register LED class
	* Clean up on unload

Control Flow (UG‑level)

	User writes: `echo 1 > /sys/class/leds/myled/brightness`

	Flow inside kernel:

		LED class framework
			  ↓
		myled_brightness_set(value)
			  ↓
		gpio_set_value(28, value)
			  ↓
		Hardware pin drives HIGH/LOW
			  ↓
		LED turns ON/OFF


Kernel APIs We Will Use (Only the Required Minimum)
Your module will use:
* gpio_request()
* gpio_direction_output()
* gpio_set_value()
* led_classdev_register()
* led_classdev_unregister()




