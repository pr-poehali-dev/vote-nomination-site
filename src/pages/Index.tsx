import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Nomination {
  id: string;
  title: string;
  description: string;
  icon: string;
  options: string[];
}

const nominations: Nomination[] = [
  {
    id: '1',
    title: 'Лучший продукт года',
    description: 'Самый инновационный и востребованный продукт 2024',
    icon: 'Trophy',
    options: ['Умная колонка Echo Pro', 'Фитнес-браслет FitMax', 'Беспроводные наушники AirPods Ultra', 'Смарт-часы Galaxy Watch 6']
  },
  {
    id: '2',
    title: 'Лучший сервис',
    description: 'Сервис с лучшим клиентским опытом',
    icon: 'Award',
    options: ['Доставка ExpressFood', 'Стриминг MusicFlow', 'Такси CityRide', 'Облачное хранилище CloudSpace']
  },
  {
    id: '3',
    title: 'Открытие года',
    description: 'Новая компания или проект, который произвел фурор',
    icon: 'Sparkles',
    options: ['Стартап AI Helper', 'Экомагазин GreenChoice', 'Платформа EduTech', 'Финтех сервис PayFast']
  },
  {
    id: '4',
    title: 'Лучший дизайн',
    description: 'Самый стильный и продуманный дизайн',
    icon: 'Palette',
    options: ['Мобильное приложение Banko', 'Сайт DesignHub', 'Интерфейс SmartHome', 'Брендинг CoffeeTime']
  },
  {
    id: '5',
    title: 'Инновация года',
    description: 'Прорывная технология или идея',
    icon: 'Rocket',
    options: ['AI-ассистент VoiceGenius', 'VR-платформа MetaSpace', 'Квантовый процессор QuantumX', 'Робот-курьер DeliveryBot']
  },
  {
    id: '6',
    title: 'Выбор сообщества',
    description: 'Любимый проект пользователей',
    icon: 'Users',
    options: ['Социальная сеть FriendZone', 'Форум TechTalk', 'Игра PixelWorld', 'Блог-платформа WriteNow']
  },
  {
    id: '7',
    title: 'Экологичный проект',
    description: 'Вклад в устойчивое развитие и экологию',
    icon: 'Leaf',
    options: ['ЭкоТакси GreenRide', 'Приложение RecycleIt', 'Солнечные панели SolarTech', 'Пластик-переработка EcoPlast']
  }
];

const VOTING_END_DATE = new Date('2024-12-31T23:59:59');

const Index = () => {
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [hasVoted, setHasVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [selectedTab, setSelectedTab] = useState('voting');
  const { toast } = useToast();

  useEffect(() => {
    const savedVotes = localStorage.getItem('userVotes');
    if (savedVotes) {
      setVotes(JSON.parse(savedVotes));
      setHasVoted(true);
    }

    const timer = setInterval(() => {
      const now = new Date();
      const difference = VOTING_END_DATE.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days}д ${hours}ч ${minutes}м`);
      } else {
        setTimeLeft('Голосование завершено');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVote = (nominationId: string, option: string) => {
    if (hasVoted) {
      toast({
        title: "Вы уже проголосовали!",
        description: "Можно проголосовать только один раз",
        variant: "destructive"
      });
      return;
    }

    setVotes(prev => ({ ...prev, [nominationId]: option }));
  };

  const submitVotes = () => {
    if (Object.keys(votes).length < nominations.length) {
      toast({
        title: "Заполните все номинации",
        description: `Осталось выбрать: ${nominations.length - Object.keys(votes).length}`,
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('userVotes', JSON.stringify(votes));
    setHasVoted(true);
    setSelectedTab('results');
    
    toast({
      title: "Спасибо за участие! 🎉",
      description: "Ваш голос учтен",
    });
  };

  const calculateResults = () => {
    const results: Record<string, Record<string, number>> = {};
    
    nominations.forEach(nom => {
      results[nom.id] = {};
      nom.options.forEach(opt => {
        results[nom.id][opt] = Math.floor(Math.random() * 150) + 50;
      });
    });

    return results;
  };

  const results = calculateResults();

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 pointer-events-none" />
      
      <div className="relative z-10">
        <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-fade-in">
                  Народное голосование 2024
                </h1>
                <p className="text-muted-foreground mt-2">Выбери лучших из лучших</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Clock" size={16} />
                  <span>Осталось:</span>
                </div>
                <div className="text-2xl font-bold text-primary animate-pulse-glow">
                  {timeLeft}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="voting" className="gap-2">
                <Icon name="Vote" size={16} />
                Голосование
              </TabsTrigger>
              <TabsTrigger value="nominations" className="gap-2">
                <Icon name="List" size={16} />
                Номинации
              </TabsTrigger>
              <TabsTrigger value="results" className="gap-2">
                <Icon name="BarChart3" size={16} />
                Результаты
              </TabsTrigger>
            </TabsList>

            <TabsContent value="voting" className="space-y-6 animate-fade-in">
              {nominations.map((nomination, index) => (
                <Card 
                  key={nomination.id} 
                  className="p-6 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-primary">
                      <Icon name={nomination.icon as any} size={24} className="text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{nomination.title}</h3>
                      <p className="text-sm text-muted-foreground">{nomination.description}</p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {nomination.options.map((option) => (
                      <Button
                        key={option}
                        variant={votes[nomination.id] === option ? "default" : "outline"}
                        className={`justify-start h-auto py-4 px-6 transition-all duration-300 ${
                          votes[nomination.id] === option 
                            ? 'bg-gradient-primary border-0 text-primary-foreground shadow-lg scale-[1.02]' 
                            : 'hover:border-primary/50 hover:scale-[1.01]'
                        }`}
                        onClick={() => handleVote(nomination.id, option)}
                        disabled={hasVoted}
                      >
                        <div className="flex items-center gap-3 w-full">
                          {votes[nomination.id] === option && (
                            <Icon name="CheckCircle" size={20} className="animate-scale-in" />
                          )}
                          <span className="flex-1 text-left">{option}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </Card>
              ))}

              {!hasVoted && (
                <div className="flex justify-center pt-4">
                  <Button 
                    size="lg"
                    onClick={submitVotes}
                    className="bg-gradient-primary hover:opacity-90 transition-opacity px-12 py-6 text-lg font-bold shadow-xl animate-pulse-glow"
                  >
                    <Icon name="Send" size={20} className="mr-2" />
                    Отправить голос
                  </Button>
                </div>
              )}

              {hasVoted && (
                <Card className="p-6 bg-gradient-accent border-0 text-center animate-scale-in">
                  <Icon name="CheckCircle" size={48} className="mx-auto mb-4 text-accent-foreground" />
                  <h3 className="text-2xl font-bold mb-2 text-accent-foreground">Спасибо за участие!</h3>
                  <p className="text-accent-foreground/80">Ваш голос учтен. Результаты доступны во вкладке "Результаты"</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="nominations" className="space-y-6 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                {nominations.map((nomination, index) => (
                  <Card 
                    key={nomination.id} 
                    className="p-6 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-4 rounded-xl bg-gradient-primary shrink-0">
                        <Icon name={nomination.icon as any} size={32} className="text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{nomination.title}</h3>
                        <p className="text-muted-foreground mb-4">{nomination.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {nomination.options.map((option) => (
                            <span 
                              key={option}
                              className="px-3 py-1 rounded-full bg-muted text-xs font-medium"
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-6 animate-fade-in">
              {nominations.map((nomination, index) => {
                const nominationResults = results[nomination.id];
                const total = Object.values(nominationResults).reduce((a, b) => a + b, 0);
                const sortedOptions = Object.entries(nominationResults).sort((a, b) => b[1] - a[1]);

                return (
                  <Card 
                    key={nomination.id} 
                    className="p-6 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-primary">
                        <Icon name={nomination.icon as any} size={24} className="text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{nomination.title}</h3>
                        <p className="text-sm text-muted-foreground">Всего голосов: {total}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {sortedOptions.map(([option, count], idx) => {
                        const percentage = Math.round((count / total) * 100);
                        return (
                          <div key={option} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium flex items-center gap-2">
                                {idx === 0 && <Icon name="Crown" size={16} className="text-yellow-500" />}
                                {option}
                              </span>
                              <span className="text-muted-foreground">{count} ({percentage}%)</span>
                            </div>
                            <Progress 
                              value={percentage} 
                              className="h-3"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
            </TabsContent>
          </Tabs>
        </main>

        <footer className="border-t border-border/50 backdrop-blur-sm bg-background/80 mt-16">
          <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
            <p>Народное голосование 2024 • Все права защищены</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
