# Mini60App
Android and Windows 10 app for Bluetooth control of the Mini 60 and SARK 100 antenna analyzers.

### NOTE: this is a work in progress to update the Open60 app.  Use https://github.com/ishmal/open60 for now.

BUT if you would like to try the new stuff, check out the releases page: https://github.com/ishmal/mini60/releases


![Alt text](misc/mini60.jpg?raw=true "MINI60")
![Alt text](misc/demo-40m-tooltip.png?raw=true "example")
![Alt text](misc/demo-20m-win.png?raw=true "example")

### About

Two years ago I received a Bluetooth-equipped Mini60 Antenna Analyzer from a Chinese eBay seller.  It is an assembled
version of the SARK100 antenna analyzer.  It seems to be made well and robust.  It did not come with software, but
searching revealed Bluetooth clients for Windows and Android.  The Android client can be downloaded from several
places, yet I cannot find an "official" site for it, nor can I find any documentation.  The Mini60.apk that I found
on several different sites crashed on every attempt to connect.

I thought "how hard can it be?" and downloaded the SARK100 manual from here: http://www.casogo.com/Manual/SARK100.pdf.
Page 77 lists the PC commands and the results.  It seems quite straightforward and simple.  And it is!

It has only been a few weeks but I already have my own Android client working, based on Apache Cordova.  It's a trivial
little app, but it does everything I need.  Maybe it can be useful for you, too.  I have seen a lot of postings
by people frustrated with their Bluetooth connection not working.  Maybe this can help!.

### Downloads

Installable .apk files for Android can be found here:  https://github.com/ishmal/open60/releases .  The easiest way to install is to browse to the releases page with your Android device's browser, and click the link.  Your browser will ask you how to continue.

### Observations about the Mini60

The USB port will provide enough power for the CPU,  but seems not be be sufficient for the Bluetooth adapter.  You will
either need the 12v charger,  or let the batteries charge up overnight.

The 12v power socket is 1.2mm .  I could not find this documented anywhere, but that's what it is.

The USB socket is for a "mini b" connector, not the much more common "micro".


