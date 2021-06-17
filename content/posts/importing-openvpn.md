+++
date = "2020-10-30"
title = "Importing OpenVPN Configuration"
description = "Hands-on tutorial on how to import OpenVPN configuration on Linux from NetworkManager easily."
images = ["/images/OpenVPN_logo.webp"]
keywords = "linux openvpn networkmanager"
tags = [
    "development",
]
categories = [
    "Development",
    "Linux"
]
series = ["Linux"]
+++

OpenVPN is an open-source Virtual Private Network (VPN) system that implements techniques to create secure point-to-point or site-to-site connections in routed or bridged configurations and remote access facilities.
It allows peers to authenticate each other using pre-shared secret keys, certificates, or username/password.
It is recognized industry-wide as the most secure VPN encryption protocol.
As well as being remarkably reliable, OpenVPN is highly customizable and can be implemented by users in several ways.

The OpenVPN protocol is responsible for handling client-server communications.
It allows you to connect to a remote network over a secure, encrypted connection and mask your IP addresses over all ports.
When OpenVPN handles encryption and authentication, it uses the OpenSSL library quite extensively.

Setting up OpenVPN in Linux is fairly easy.
You can import its configuration from the NetworkManager, _nm-connection-editor_, to be more specific.
The configuration of OpenVPN has `.openvpn` extension.
I want this blog to be a hands-on tutorial on how to import it.
So, let’s get started.

First of all, you should download the OpenVPN configuration.
It can be downloaded be from any service provider of your choice, but for this blog, I will be using the [vpnbook](https://www.vpnbook.com/freevpn) for the sake of simplicity.

![vpnbook screenshot](/images/vpnbook_screenshot.webp#center)

The picture shown above is the screenshot of the link to the vpnbook provided above.
Download any OpenVPN Certificate Bundle from the provided ones according to your location and need.
I downloaded [US1 OpenVPN Certificate Bundle](https://www.vpnbook.com/free-openvpn-account/VPNBook.com-OpenVPN-US1.zip).
Now let's go ahead and look at the contents of the zip file you just downloaded.

![openvpn bundle contents](/images/openvpn_bundle_contents.webp#center)

The zip contained the files shown in the figure above.
As said on the vpnbook website, they are _UDP 53_, _UDP 25000_, _TCP 80_, and _TCP 443_ profiles.
For those of you who don’t know about them, TCP and UDP are protocols and, the numbers beside them are the port in which they operate.
For example, `vpnbook-us1-udp53.openvpn` has a configuration for UDP protocol on port 53 for the VPN.

Now let’s go ahead and import them from the NetworkManager.
But hold on, have you installed the OpenVPN client needed to operate it?
If not, install the _openvpn_ package required for OpenVPN.
Since we are going to import them from the NetworkManager, we need a plugin called _networkmanager-openvpn_.
Depending on which Linux distribution you are on, the package name may differ slightly and, it may also have been included inside the _networkmanager_ package.
Since I am on Arch (I use Arch, btw! 😜), those package names belong to Arch.
So, go ahead and do some research for your distribution and install those prerequisites.

We will be importing the configuration from the _nm-connection-editor_ command.
It is a NetworkManager GUI connection editor.
So, go ahead and enter _nm-connection-editor_ in your terminal or, if you are not a fan of entering commands in the terminal, right-click your NetworkManager applet from your taskbar and click on _Edit Connections…_.
Now, you will see a window showing all of your previous network connections.
Click the **+** icon on the bottom left corner to add a connection.

You’ll be prompted to choose a connection type from the dropdown, which will default on _Ethernet_.
Choose "Import a saved VPN configuration" **not VPN**, which is the last element in the dropdown for my case.
Then click _Create_.
This also shows a quick reminder to install the openvpn plugin for NetworkManager if you haven’t already.

After clicking _Create_, you will be prompted to choose the OpenVPN configuration file.
Go ahead and show it the `.openvpn` file of your choice.
Quick info: **UDP is faster but can result in data loss and, TCP is more reliable**.
The Vpnbook instructs you to use TCP if you cannot connect to UDP due to network restriction.
I am choosing `vpnbook-us1-udp53.openvpn` and importing it.
However, you can import any one of the four files.

![openvpn configuration imported](/images/openvpn_imported.webp#center)

As you can see, the NetworkManager automatically imports the settings for you;
You don’t have to manually type it.
The configuration just imported had a key and a certificate inside it.
So the network manager created them inside the `.cert` directory in your `$HOME` directory.
If you have a different file for your certificate and/or key, then also NetworkManager imports it/them in the configuration.
But you shouldn’t move them since it stores their location there.
If you happen to move any of those files, you must update their path in this configuration in _nm-connection-editor_.

Every OpenVPN service you use has a username and password associated with your account.
Since the vpnbook has a common username and password for all the users, its username remains the same but, its password changes from time to time.
So if you are using the vpnbook and cannot connect to the VPN service, the chances are the password has been changed.
Now go ahead and copy the username and password from the [vpnbook](https://www.vpnbook.com/freevpn) and paste it into the configuration shown above.
You can change the _Connection name_ if you like but should not alter other fields if you don’t know what you are exactly doing.
Hit _Save_ when you are done.

Now when you click on the network manager applet on the taskbar, you can see the connection name for the VPN set above inside _VPN Connections_.
Click on the VPN you want to activate.
The network manager tries to connect you to the VPN selected.
The icon of the network manager applet also changes.

The [vpnbook](https://www.vpnbook.com/freevpn) was chosen in this tutorial for the sake of simplicity.
It is free for everyone so, it's sluggish and, you might not have established a successful VPN connection due to this.
You can try again if it doesn’t connect for the first time.

Right now, I have imported the [TunnelBear OpenVPN config files](https://s3.amazonaws.com/tunnelbear/linux/openvpn.zip) in the same way as above.
Here for username and password, you have to enter the email and password you used when creating an account on [TunnelBear](https://www.tunnelbear.com/).
It gives you 500MB network transfer per month for free package users. For more, you have to pay for them.

You can also set up OpenVPN by moving the files to `/etc/openvpn/client` and starting the openvpn service from the command line.
More about the process [here](https://wiki.archlinux.org/index.php/TunnelBear).
But I don’t like to use root access if it can be done by any user.
The method described in this blog works for users without superuser privileges also.
The only place where superuser privileges are required is when installing the prerequisite packages.

So that’s all for today.
Let me know your views and reactions in the comments below.
