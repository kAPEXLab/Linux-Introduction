obj-m := myled.o

KDIR := $(SDKTARGETSYSROOT)/lib/modules/$(shell \
	ls $(SDKTARGETSYSROOT)/lib/modules)/build

PWD := $(shell pwd)

all:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean
