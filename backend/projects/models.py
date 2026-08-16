from django.db import models

class Project(models.Model):
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('DONE', 'Done'),
        ('ARCHIVED', 'Archived'),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

"""

CharField(max_length=100): string curta, tamanho obrigatório — como @Column(length=100) em JPA.

TextField: texto longo, sem limite fixo. blank=True significa que o campo pode ficar vazio nos formulários/validação
 (isso é diferente de null=True, que é sobre o banco — vamos ver isso na prática se precisar).

choices: define um conjunto fixo de valores válidos — parecido com um enum no Java.
auto_now_add=True: preenche automaticamente com a data/hora no momento da criação, e nunca mais muda. 
Equivalente a um @CreationTimestamp do Hibernate.
id não precisa ser declarado — Django cria automaticamente.

__str__: define como o objeto aparece quando impresso (útil no admin do Django e no shell). 
Não tem equivalente direto obrigatório no Java, é mais um "nice to have" do Python (toString() seria o análogo).
CharField(max_length=100): string curta, tamanho obrigatório — como @Column(length=100) em JPA.

TextField: texto longo, sem limite fixo. blank=True significa que o campo pode ficar vazio nos formulários/validação
 (isso é diferente de null=True, que é sobre o banco — vamos ver isso na prática se precisar).

choices: define um conjunto fixo de valores válidos — parecido com um enum no Java.
auto_now_add=True: preenche automaticamente com a data/hora no momento da criação, e nunca mais muda.
 Equivalente a um @CreationTimestamp do Hibernate.
id não precisa ser declarado — Django cria automaticamente.

__str__: define como o objeto aparece quando impresso (útil no admin do Django e no shell).
 Não tem equivalente direto obrigatório no Java, é mais um "nice to have" do Python (toString() seria o análogo).

"""

class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')

    def __str__(self):
        return self.title

"""
Explicando o campo project:

ForeignKey(Project, ...): cria a coluna project_id na tabela de Task,
referenciando o id de Project.

on_delete=models.CASCADE: se o Project for deletado, todas as Tasks associadas são deletadas junto.
Equivalente ao cascade = CascadeType.REMOVE no JPA.

related_name='tasks': permite acessar as tasks de um project assim: project.tasks.all().
É o equivalente ao lado inverso do @OneToMany no JPA (project.getTasks()).

"""