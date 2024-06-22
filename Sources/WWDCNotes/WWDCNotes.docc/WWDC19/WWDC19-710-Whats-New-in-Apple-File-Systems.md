# What's New in Apple File Systems

Learn about what's new in file system technology, including changes to file system layout and imaging technologies. If you are affected by the new Read Only System Volume, this is a session you will not want to miss.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/710", purpose: link, label: "Watch Video (34 min)")

   @Contributors {
      @GitHubUser(Blackjacx)
   }
}




## Protecting System Software

- System integrity protection to prevent file system (FS) modification by malicious software
- System FS will now be read-only
- Connection between read-only and read-write FS by **Firmlinks**
- **Firmlinks**
  - Consistent forward and backward traversal of the file name space
  - For directories only
  - Created on the system volume on installation time
  - Neither expected to be noticed by any user nor application

- Read-only state can be disabled temporarily until after a reboot

## Apple Software Restore (ASR), Volume Replication and Snapshots

- Intention is to copy whole volume content including metadata which is superior to file-only copy
- Usable by Enterprise/Education, IT to setup labs and/or backup utilities
- New: APFS volume replication with ASR
  - Decryption / Encryption is no part of generation / restore process (on-the-fly defragmentation)
  - Restore and erase target volume: `sudo asr restore --source file.dmg --target /Volumes/Volume2 --erase`
  - Restore to newly created target volume: `sudo asr restore --source file.dmg --target /dev/disk1`
  - Restore with snapshots: `sudo asr restore --source file.dmg --target /Volumes/Target --toSnapshot Snap1`
  - Restore snapshot delta: `sudo asr restore --source file.dmg --target /Volumes/Target --fromSnapshot Snap1 --toSnapshot Snap2`

## External File Access on iOS

- Access files from network (SMB 3.0) and USB (unencrypted APFS, unencrypted HFS Plus, FAT, ExFAT) sources
- For security reasons all FS manipulations happen in dedicate process space, not in kernel
- Pay attention to volume capabilities (case sensitivity, ...)
- File movement may take time now
- External devices can disappear
