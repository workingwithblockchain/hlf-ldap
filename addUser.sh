#! /bin/bash

if [ "$#" -ne 2 ];
    then echo "Usage: addUser.sh <firstname> <lastname>"
    exit
fi

cat >/tmp/newUser.ldif <<EOF
dn: cn=$1,dc=example,dc=org
changetype: add
cn: $1
sn: $2
objectClass: organizationalPerson
objectClass: person
objectClass: top
EOF

docker exec my-openldap-container ldapadd -x -w "adminpw" -D "cn=admin,dc=example,dc=org" -f /tmp/newUser.ldif